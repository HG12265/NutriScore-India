from typing import List, Union
import json
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "NutriScore AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    
    # CORS settings: accepts '*' string, comma-separated string, or list of strings
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parsed list of CORS origin strings for middleware configuration."""
        if isinstance(self.CORS_ORIGINS, str):
            val = self.CORS_ORIGINS.strip()
            if val == "*" or not val:
                return ["*"]
            if val.startswith("[") and val.endswith("]"):
                try:
                    return json.loads(val)
                except Exception:
                    pass
            return [o.strip() for o in val.split(",") if o.strip()]
        return list(self.CORS_ORIGINS)
    
    # 100% Indian Algorithm configuration: icmr_nin_2024 | full_39_nutrient | icmr_16_nutrient
    DEFAULT_ALGORITHM_MODE: str = "icmr_nin_2024"
    
    # MongoDB integration (Strictly MongoDB, no SQL)
    ENABLE_HISTORY: bool = True
    MONGODB_URI: str = "mongodb+srv://nutriscoreindia_db_user:dlzDkNpP6aMSFj4e@cluster0.3thw6ts.mongodb.net/?retryWrites=true&w=majority"
    MONGODB_DATABASE: str = "nutriscore"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }


settings = Settings()
