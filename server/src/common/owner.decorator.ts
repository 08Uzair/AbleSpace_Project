import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const OwnerId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return (req.headers["x-user-id"] || "guest").toString().slice(0, 200);
  }
);
