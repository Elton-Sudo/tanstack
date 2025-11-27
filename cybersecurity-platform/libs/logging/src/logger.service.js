"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const pino_1 = require("pino");
let LoggerService = class LoggerService {
    constructor() {
        const isDevelopment = process.env.NODE_ENV !== 'production';
        this.logger = (0, pino_1.default)({
            level: process.env.LOG_LEVEL || 'info',
            formatters: {
                level: (label) => {
                    return { level: label.toUpperCase() };
                },
            },
            transport: isDevelopment
                ? {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                        ignore: 'pid,hostname',
                        singleLine: false,
                    },
                }
                : undefined,
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
        });
    }
    log(message, context) {
        this.logger.info({ context }, message);
    }
    error(message, trace, context) {
        this.logger.error({ context, trace }, message);
    }
    warn(message, context) {
        this.logger.warn({ context }, message);
    }
    debug(message, context) {
        this.logger.debug({ context }, message);
    }
    verbose(message, context) {
        this.logger.trace({ context }, message);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map