"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const perf_hooks_1 = require("perf_hooks");
class PerformanceLogger {
    isEnabled = false;
    tasksData = new Map();
    timersData = new Map();
    enable() {
        this.isEnabled = true;
    }
    trackTask(topic, subtopic) {
        const uid = crypto_1.default.randomBytes(32).toString("hex");
        if (this.timersData.has(uid)) {
            throw new Error(`Duplicate benchmark timer UID: ${uid}`);
        }
        this.timersData.set(uid, {
            topic,
            subtopic,
            startTime: perf_hooks_1.performance.now(),
        });
        return uid;
    }
    endTask(uid) {
        if (!this.timersData.has(uid)) {
            throw new Error(`Unknown benchmark timer UID: ${uid}`);
        }
        const timerData = this.timersData.get(uid);
        const timerDuration = perf_hooks_1.performance.now() - timerData.startTime;
        this.timersData.delete(uid);
        if (!this.tasksData.has(timerData.topic)) {
            this.tasksData.set(timerData.topic, []);
        }
        this.tasksData.get(timerData.topic).push({
            subtopic: timerData.subtopic,
            duration: timerDuration,
        });
    }
    printRecap() {
        if (!this.isEnabled) {
            return;
        }
        const data = [];
        for (const [topic, entries] of this.tasksData.entries()) {
            if (entries.length < 1) {
                continue;
            }
            let min = entries[0].duration;
            let max = entries[0].duration;
            let total = 0;
            const average = entries.reduce((average, entry) => {
                if (min > entry.duration) {
                    min = entry.duration;
                }
                if (max < entry.duration) {
                    max = entry.duration;
                }
                total += entry.duration;
                return average + entry.duration;
            }, 0) / entries.length;
            data.push({
                Topic: topic,
                Min: this.formatDuration(min),
                Max: this.formatDuration(max),
                Average: this.formatDuration(average),
                Total: this.formatDuration(total),
            });
        }
        console.table(data);
    }
    printTasks(topic) {
        if (!this.isEnabled) {
            return;
        }
        if (!this.tasksData.has(topic)) {
            throw new Error(`Unknown benchmark topic: ${topic}`);
        }
        const data = [];
        let totalDuration = 0;
        for (const entry of this.tasksData.get(topic)) {
            data.push({
                Topic: topic,
                Subtopic: entry.subtopic ?? "-",
                Time: this.formatDuration(entry.duration),
            });
            totalDuration += entry.duration;
        }
        console.table(data);
        console.log(`Total: ${this.formatDuration(totalDuration)}`);
    }
    printIncompleteTasks() {
        if (!this.isEnabled) {
            return;
        }
        if (this.timersData.size < 1) {
            console.log("All tasks completed successfully.");
            return;
        }
        const data = [];
        for (const entry of this.timersData.values()) {
            data.push({
                Topic: entry.topic,
                Subtopic: entry.subtopic ?? "-",
                "Started At": this.formatDuration(entry.startTime),
            });
        }
        console.table(data);
    }
    formatDuration(duration) {
        const isSeconds = duration >= 1000;
        const value = isSeconds ? duration / 1000 : duration;
        const unit = isSeconds ? "s" : "ms";
        return `${value.toFixed(2)} ${unit}`;
    }
}
const performanceLoggerInstance = new PerformanceLogger();
exports.default = performanceLoggerInstance;
