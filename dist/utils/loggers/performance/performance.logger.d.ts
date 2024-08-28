declare class PerformanceLogger {
    private isEnabled;
    private tasksData;
    private timersData;
    enable(): void;
    trackTask(topic: string, subtopic?: string): string;
    endTask(uid: string): void;
    printRecap(): void;
    printTasks(topic: string): void;
    printIncompleteTasks(): void;
    private formatDuration;
}
declare const performanceLoggerInstance: PerformanceLogger;
export default performanceLoggerInstance;
//# sourceMappingURL=performance.logger.d.ts.map