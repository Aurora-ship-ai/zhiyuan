"""
依赖注入 — 鉴权、会话管理
"""
from fastapi import Depends, HTTPException, Header
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from .config import settings

security = HTTPBearer(auto_error=False)


async def get_current_user(
    authorization: str | None = Header(default=None),
) -> str:
    """
    验证 JWT Token，返回 user_id。
    绝不相信前端传来的任何身份声明，必须验签。
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效认证令牌")

    token = authorization.split(" ", 1)[1]

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="令牌无效")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="令牌无效或已过期")
