
import os
import redis
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
r = redis.Redis(
            host = REDIS_HOST,
            port=int (REDIS_PORT),
            password=REDIS_PASSWORD,
            decode_responses=True  # Đảm bảo rằng các giá trị được giải mã từ byte sang string
    )