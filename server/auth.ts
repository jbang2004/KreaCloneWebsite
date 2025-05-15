import { Express, Request, Response, NextFunction } from "express";
// import { supabase } from "../supabase"; // Supabase 客户端不再在此文件直接使用
// import { User as SelectUser } from "../shared/schema"; // User 类型定义可能不再需要，除非其他地方使用

export function setupAuth(app: Express) {
  // 由于客户端将直接与 Supabase 通信进行身份验证，
  // 后端不再需要 /api/register, /api/login, /api/logout 路由。
  // /api/user 路由的功能也由客户端的 supabase.auth.getUser() 或 onAuthStateChange() 替代。

  // 如果您有其他需要服务器端验证用户身份的受保护 API 路由，
  // 您可以在这里或相应的中间件中实现 Supabase JWT 的验证逻辑。
  // 例如，从 Authorization header 获取 token，然后使用 supabase.auth.getUser(token) 进行验证。

  // 目前，此函数可以为空，或者您可以根据需要添加其他服务器端认证相关设置。
  // 如果此文件不再有其他用途，也可以考虑将其从服务器设置中移除。

  // 示例：一个受保护的路由，演示如何在后端验证用户
  /*
  app.get("/api/protected-data", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token or user not found" });
    }

    // 用户已通过验证，可以继续处理请求
    res.json({ message: "This is protected data for user: " + user.email });
  });
  */
}