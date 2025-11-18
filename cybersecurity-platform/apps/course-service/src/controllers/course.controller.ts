import { JwtAuthGuard, Roles, RolesGuard } from '@app/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AssignInstructorDto,
  CourseSearchDto,
  CreateChapterDto,
  CreateCourseDto,
  CreateModuleDto,
  DuplicateCourseDto,
  PublishCourseDto,
  UpdateChapterDto,
  UpdateCourseDto,
  UpdateModuleDto,
} from '../dto/course.dto';
import { CourseService } from '../services/course.service';

@ApiTags('courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createCourseDto: CreateCourseDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const createdBy = req.user.userId;

    // Ensure non-super-admins can only create courses in their tenant
    if (req.user.role !== 'SUPER_ADMIN') {
      createCourseDto.tenantId = tenantId;
    }

    return this.courseService.create(createCourseDto, createdBy);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'MANAGER', 'USER')
  @ApiOperation({ summary: 'Get all courses with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  async findAll(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query() searchDto?: CourseSearchDto,
  ) {
    const tenantId = req.user.tenantId;

    // Super admin can query all tenants or specific tenant
    const queryTenantId =
      req.user.role === 'SUPER_ADMIN' && req.query.tenantId ? req.query.tenantId : tenantId;

    return this.courseService.findAll(queryTenantId, page, limit, searchDto);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'MANAGER', 'USER')
  @ApiOperation({ summary: 'Get course by ID with modules and chapters' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.courseService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Update course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const updatedBy = req.user.userId;
    return this.courseService.update(id, tenantId, updateCourseDto, updatedBy);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Delete course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete course with enrollments' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const deletedBy = req.user.userId;
    await this.courseService.delete(id, tenantId, deletedBy);
    return { message: 'Course deleted successfully' };
  }

  @Post(':id/publish')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Publish course' })
  @ApiResponse({ status: 200, description: 'Course published successfully' })
  @ApiResponse({ status: 400, description: 'Cannot publish course without modules' })
  async publish(@Param('id') id: string, @Body() publishDto: PublishCourseDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const publishedBy = req.user.userId;
    return this.courseService.publish(id, tenantId, publishDto, publishedBy);
  }

  @Post(':id/archive')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Archive course' })
  @ApiResponse({ status: 200, description: 'Course archived successfully' })
  async archive(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    const archivedBy = req.user.userId;
    return this.courseService.archive(id, tenantId, archivedBy);
  }

  @Post(':id/duplicate')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Duplicate course' })
  @ApiResponse({ status: 201, description: 'Course duplicated successfully' })
  async duplicate(
    @Param('id') id: string,
    @Body() duplicateDto: DuplicateCourseDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const duplicatedBy = req.user.userId;
    return this.courseService.duplicate(id, tenantId, duplicateDto, duplicatedBy);
  }

  @Get(':id/stats')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR', 'MANAGER')
  @ApiOperation({ summary: 'Get course statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.courseService.getCourseStats(id, tenantId);
  }

  @Post(':id/instructors')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  @ApiOperation({ summary: 'Assign instructor to course' })
  @ApiResponse({ status: 200, description: 'Instructor assigned successfully' })
  async assignInstructor(
    @Param('id') id: string,
    @Body() assignDto: AssignInstructorDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const assignedBy = req.user.userId;
    await this.courseService.assignInstructor(id, tenantId, assignDto.instructorId, assignedBy);
    return { message: 'Instructor assigned successfully' };
  }

  // Module endpoints

  @Post(':id/modules')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Create module in course' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  async createModule(
    @Param('id') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const createdBy = req.user.userId;
    return this.courseService.createModule(courseId, tenantId, createModuleDto, createdBy);
  }

  @Patch(':courseId/modules/:moduleId')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Update module' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  async updateModule(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const updatedBy = req.user.userId;
    return this.courseService.updateModule(
      moduleId,
      courseId,
      tenantId,
      updateModuleDto,
      updatedBy,
    );
  }

  @Delete(':courseId/modules/:moduleId')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Delete module' })
  @ApiResponse({ status: 200, description: 'Module deleted successfully' })
  async deleteModule(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const deletedBy = req.user.userId;
    await this.courseService.deleteModule(moduleId, courseId, tenantId, deletedBy);
    return { message: 'Module deleted successfully' };
  }

  // Chapter endpoints

  @Post(':courseId/modules/:moduleId/chapters')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Create chapter in module' })
  @ApiResponse({ status: 201, description: 'Chapter created successfully' })
  async createChapter(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() createChapterDto: CreateChapterDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const createdBy = req.user.userId;
    return this.courseService.createChapter(
      moduleId,
      courseId,
      tenantId,
      createChapterDto,
      createdBy,
    );
  }

  @Patch(':courseId/modules/:moduleId/chapters/:chapterId')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Update chapter' })
  @ApiResponse({ status: 200, description: 'Chapter updated successfully' })
  async updateChapter(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('chapterId') chapterId: string,
    @Body() updateChapterDto: UpdateChapterDto,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const updatedBy = req.user.userId;
    return this.courseService.updateChapter(
      chapterId,
      moduleId,
      courseId,
      tenantId,
      updateChapterDto,
      updatedBy,
    );
  }

  @Delete(':courseId/modules/:moduleId/chapters/:chapterId')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Delete chapter' })
  @ApiResponse({ status: 200, description: 'Chapter deleted successfully' })
  async deleteChapter(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('chapterId') chapterId: string,
    @Req() req: any,
  ) {
    const tenantId = req.user.tenantId;
    const deletedBy = req.user.userId;
    await this.courseService.deleteChapter(chapterId, moduleId, courseId, tenantId, deletedBy);
    return { message: 'Chapter deleted successfully' };
  }
}
