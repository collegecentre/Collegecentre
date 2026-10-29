/**
 * CollegeCentre - Production Observability & Structured Logger
 */

type LogLevel = "info" | "warn" | "error" | "audit";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  environment: string;
  context?: Record<string, any>;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

class Logger {
  private environment = process.env.NODE_ENV || "development";

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    err?: Error | unknown
  ): string {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      ...(context ? { context } : {}),
    };

    if (err instanceof Error) {
      payload.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    } else if (err) {
      payload.error = {
        message: String(err),
      };
    }

    return JSON.stringify(payload);
  }

  info(message: string, context?: Record<string, any>) {
    if (this.environment === "production") {
      console.log(this.formatMessage("info", message, context));
    } else {
      console.log(`[INFO] ${message}`, context || "");
    }
  }

  warn(message: string, context?: Record<string, any>) {
    if (this.environment === "production") {
      console.warn(this.formatMessage("warn", message, context));
    } else {
      console.warn(`[WARN] ${message}`, context || "");
    }
  }

  error(message: string, err?: Error | unknown, context?: Record<string, any>) {
    if (this.environment === "production") {
      console.error(this.formatMessage("error", message, context, err));
    } else {
      console.error(`[ERROR] ${message}`, err || "", context || "");
    }
  }

  audit(action: string, userId?: string, metadata?: Record<string, any>) {
    const auditContext = {
      action,
      userId: userId || "anonymous",
      ...metadata,
    };

    if (this.environment === "production") {
      console.log(this.formatMessage("audit", `AUDIT: ${action}`, auditContext));
    } else {
      console.log(`[AUDIT] ${action} by ${userId || "anonymous"}`, metadata || "");
    }
  }
}

export const logger = new Logger();
