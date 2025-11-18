import { DatabaseService } from '@app/database';
import { LoggerService } from '@app/logging';
import { EventBusService, EVENTS } from '@app/messaging';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Chapter, Course, Module } from '@prisma/client';
import {
  CourseSearchDto,
  CourseStatus,
  CreateChapterDto,
  CreateCourseDto,
  CreateModuleDto,
  DuplicateCourseDto,
  PublishCourseDto,
  UpdateChapterDto,
  UpdateCourseDto,
  UpdateModuleDto,
} from '../dto/course.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
  ) {}

  async create(createCourseDto: CreateCourseDto, createdBy: string): Promise<Course> {
    const { modules, ...courseData } = createCourseDto;

    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: createCourseDto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Create course with modules
    const course = await this.prisma.course.create({
      data: {
        ...courseData,
        status: CourseStatus.DRAFT,
        version: 1,
        tags: courseData.tags || [],
        prerequisites: courseData.prerequisites || [],
        modules: modules
          ? {
              create: modules.map((module) => ({
                title: module.title,
                description: module.description,
                order: module.order,
              })),
            }
          : undefined,
      },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    await this.eventBus.publish(EVENTS.COURSE_CREATED, {
      courseId: course.id,
      title: course.title,
      tenantId: course.tenantId,
      category: course.category,
      createdBy,
    });

    this.logger.log(`Course created: ${course.title} by ${createdBy}`, 'CourseService');

    return course;
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    searchDto?: CourseSearchDto,
  ) {
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (searchDto?.search) {
      where.OR = [
        { title: { contains: searchDto.search, mode: 'insensitive' } },
        { description: { contains: searchDto.search, mode: 'insensitive' } },
      ];
    }

    if (searchDto?.category) {
      where.category = searchDto.category;
    }

    if (searchDto?.difficulty) {
      where.difficulty = searchDto.difficulty;
    }

    if (searchDto?.status) {
      where.status = searchDto.status;
    }

    if (searchDto?.tag) {
      where.tags = { has: searchDto.tag };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              modules: true,
              enrollments: true,
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, tenantId: string): Promise<Course> {
    const course = await this.prisma.course.findFirst({
      where: { id, tenantId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            chapters: {
              orderBy: { order: 'asc' },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID '${id}' not found`);
    }

    return course;
  }

  async update(
    id: string,
    tenantId: string,
    updateCourseDto: UpdateCourseDto,
    updatedBy: string,
  ): Promise<Course> {
    await this.findOne(id, tenantId);

    const course = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });

    await this.eventBus.publish(EVENTS.COURSE_UPDATED, {
      courseId: course.id,
      tenantId: course.tenantId,
      changes: Object.keys(updateCourseDto),
      updatedBy,
    });

    this.logger.log(`Course updated: ${id} by ${updatedBy}`, 'CourseService');

    return course;
  }

  async delete(id: string, tenantId: string, deletedBy: string): Promise<void> {
    await this.findOne(id, tenantId);

    // Check if course has enrollments
    const enrollmentCount = await this.prisma.enrollment.count({
      where: { courseId: id },
    });

    if (enrollmentCount > 0) {
      throw new BadRequestException(
        `Cannot delete course with active enrollments. Archive it instead.`,
      );
    }

    await this.prisma.course.delete({
      where: { id },
    });

    this.logger.log(`Course deleted: ${id} by ${deletedBy}`, 'CourseService');
  }

  async publish(
    id: string,
    tenantId: string,
    publishDto: PublishCourseDto,
    publishedBy: string,
  ): Promise<Course> {
    const course = await this.findOne(id, tenantId);

    if (course.status === CourseStatus.PUBLISHED) {
      throw new BadRequestException('Course is already published');
    }

    // Validate course has required content
    const moduleCount = await this.prisma.module.count({
      where: { courseId: id },
    });

    if (moduleCount === 0) {
      throw new BadRequestException('Cannot publish course without modules');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: {
        status: CourseStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    await this.eventBus.publish(EVENTS.COURSE_PUBLISHED, {
      courseId: updatedCourse.id,
      title: updatedCourse.title,
      tenantId: updatedCourse.tenantId,
      publishedBy,
      publishNotes: publishDto.publishNotes,
    });

    this.logger.log(`Course published: ${id} by ${publishedBy}`, 'CourseService');

    return updatedCourse;
  }

  async archive(id: string, tenantId: string, archivedBy: string): Promise<Course> {
    await this.findOne(id, tenantId);

    const course = await this.prisma.course.update({
      where: { id },
      data: { status: CourseStatus.ARCHIVED },
    });

    await this.eventBus.publish(EVENTS.COURSE_ARCHIVED, {
      courseId: course.id,
      tenantId: course.tenantId,
      archivedBy,
    });

    this.logger.log(`Course archived: ${id} by ${archivedBy}`, 'CourseService');

    return course;
  }

  async duplicate(
    id: string,
    tenantId: string,
    duplicateDto: DuplicateCourseDto,
    duplicatedBy: string,
  ): Promise<Course> {
    const originalCourse = await this.findOne(id, tenantId);

    // Create duplicate course
    const duplicatedCourse = await this.prisma.course.create({
      data: {
        title: duplicateDto.newTitle,
        description: originalCourse.description,
        tenantId: originalCourse.tenantId,
        category: originalCourse.category,
        difficulty: originalCourse.difficulty,
        duration: originalCourse.duration,
        thumbnail: originalCourse.thumbnail,
        scormPackage: originalCourse.scormPackage,
        tags: originalCourse.tags,
        prerequisites: originalCourse.prerequisites,
        passingScore: originalCourse.passingScore,
        certificateTemplate: originalCourse.certificateTemplate,
        createdBy: duplicatedBy,
        status: CourseStatus.DRAFT,
        version: 1,
      },
    });

    // Duplicate modules if requested
    if (duplicateDto.includeModules && (originalCourse as any).modules) {
      for (const module of (originalCourse as any).modules) {
        const duplicatedModule = await this.prisma.module.create({
          data: {
            title: module.title,
            description: module.description,
            order: module.order,
            courseId: duplicatedCourse.id,
          },
        });

        // Duplicate chapters if requested
        if (duplicateDto.includeChapters && module.chapters) {
          for (const chapter of module.chapters) {
            await this.prisma.chapter.create({
              data: {
                title: chapter.title,
                content: chapter.content,
                order: chapter.order,
                duration: chapter.duration,
                videoUrl: chapter.videoUrl,
                isRequired: chapter.isRequired,
                moduleId: duplicatedModule.id,
              },
            });
          }
        }
      }
    }

    this.logger.log(
      `Course duplicated: ${id} -> ${duplicatedCourse.id} by ${duplicatedBy}`,
      'CourseService',
    );

    return duplicatedCourse;
  }

  // Module Management

  async createModule(
    courseId: string,
    tenantId: string,
    createModuleDto: CreateModuleDto,
    createdBy: string,
  ): Promise<Module> {
    await this.findOne(courseId, tenantId);

    const module = await this.prisma.module.create({
      data: {
        ...createModuleDto,
        courseId,
      },
    });

    this.logger.log(
      `Module created: ${module.title} in course ${courseId} by ${createdBy}`,
      'CourseService',
    );

    return module;
  }

  async updateModule(
    moduleId: string,
    courseId: string,
    tenantId: string,
    updateModuleDto: UpdateModuleDto,
    updatedBy: string,
  ): Promise<Module> {
    await this.findOne(courseId, tenantId);

    const module = await this.prisma.module.update({
      where: { id: moduleId },
      data: updateModuleDto,
    });

    this.logger.log(`Module updated: ${moduleId} by ${updatedBy}`, 'CourseService');

    return module;
  }

  async deleteModule(
    moduleId: string,
    courseId: string,
    tenantId: string,
    deletedBy: string,
  ): Promise<void> {
    await this.findOne(courseId, tenantId);

    await this.prisma.module.delete({
      where: { id: moduleId },
    });

    this.logger.log(`Module deleted: ${moduleId} by ${deletedBy}`, 'CourseService');
  }

  // Chapter Management

  async createChapter(
    moduleId: string,
    courseId: string,
    tenantId: string,
    createChapterDto: CreateChapterDto,
    createdBy: string,
  ): Promise<Chapter> {
    await this.findOne(courseId, tenantId);

    const chapter = await this.prisma.chapter.create({
      data: {
        ...createChapterDto,
        moduleId,
      },
    });

    this.logger.log(
      `Chapter created: ${chapter.title} in module ${moduleId} by ${createdBy}`,
      'CourseService',
    );

    return chapter;
  }

  async updateChapter(
    chapterId: string,
    moduleId: string,
    courseId: string,
    tenantId: string,
    updateChapterDto: UpdateChapterDto,
    updatedBy: string,
  ): Promise<Chapter> {
    await this.findOne(courseId, tenantId);

    const chapter = await this.prisma.chapter.update({
      where: { id: chapterId },
      data: updateChapterDto,
    });

    this.logger.log(`Chapter updated: ${chapterId} by ${updatedBy}`, 'CourseService');

    return chapter;
  }

  async deleteChapter(
    chapterId: string,
    moduleId: string,
    courseId: string,
    tenantId: string,
    deletedBy: string,
  ): Promise<void> {
    await this.findOne(courseId, tenantId);

    await this.prisma.chapter.delete({
      where: { id: chapterId },
    });

    this.logger.log(`Chapter deleted: ${chapterId} by ${deletedBy}`, 'CourseService');
  }

  // Statistics

  async getCourseStats(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    const [enrollments, completions, averageScore] = await Promise.all([
      this.prisma.enrollment.count({
        where: { courseId: id },
      }),
      this.prisma.enrollment.count({
        where: { courseId: id, completedAt: { not: null } },
      }),
      this.prisma.enrollment.aggregate({
        where: { courseId: id, completedAt: { not: null } },
        _avg: { progress: true },
      }),
    ]);

    const completionRate = enrollments > 0 ? (completions / enrollments) * 100 : 0;

    return {
      enrollments,
      completions,
      completionRate: Math.round(completionRate * 100) / 100,
      averageProgress: Math.round((averageScore._avg.progress || 0) * 100) / 100,
    };
  }

  async assignInstructor(
    courseId: string,
    tenantId: string,
    instructorId: string,
    assignedBy: string,
  ): Promise<void> {
    await this.findOne(courseId, tenantId);

    // Verify instructor exists
    const instructor = await this.prisma.user.findFirst({
      where: { id: instructorId, tenantId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    if (instructor.role !== 'INSTRUCTOR' && instructor.role !== 'TENANT_ADMIN') {
      throw new ForbiddenException('User is not an instructor');
    }

    // Log instructor assignment (you can create a join table later for tracking)
    this.logger.log(
      `Instructor ${instructorId} assigned to course ${courseId} by ${assignedBy}`,
      'CourseService',
    );
  }
}
