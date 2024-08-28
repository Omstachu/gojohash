"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class HeroLogger {
    isEnabled = false;
    version;
    constructor() {
        this.version = JSON.parse(fs
            .readFileSync(path.join(__dirname, "..", "..", "..", "..", "package.json"))
            .toString()).version;
    }
    enable() {
        this.isEnabled = true;
    }
    printHero() {
        if (!this.isEnabled) {
            return;
        }
        console.log(`
██╗  ██╗ █████╗ ███████╗██╗  ██╗██╗     ██╗██████╗ ███████╗    ██╗      █████╗ ██████╗
██║  ██║██╔══██╗██╔════╝██║  ██║██║     ██║██╔══██╗██╔════╝    ██║     ██╔══██╗██╔══██╗
███████║███████║███████╗███████║██║     ██║██████╔╝███████╗    ██║     ███████║██████╔╝
██╔══██║██╔══██║╚════██║██╔══██║██║     ██║██╔═══╝ ╚════██║    ██║     ██╔══██║██╔══██╗
██║  ██║██║  ██║███████║██║  ██║███████╗██║██║     ███████║    ███████╗██║  ██║██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚══════╝    ╚══════╝╚═╝  ╚═╝╚═════╝

Art Engine ${this.version} 👄
      `);
    }
}
const loggerInstance = new HeroLogger();
exports.default = loggerInstance;
