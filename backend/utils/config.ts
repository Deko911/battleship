type Env = {
    PORT?: string,
    MONGODB_URI: string,
    JWT_TOKEN: string
}

function validateEnv(): Env {
    const requiredKeys: (keyof Omit<Env, 'PORT'>)[] = ['MONGODB_URI', 'JWT_TOKEN'];
    const missingKeys = requiredKeys.filter(key => !process.env[key]);
    
    if (missingKeys.length > 0) {
        throw new Error(`Variables de entorno faltantes: ${missingKeys.join(', ')}`);
    }
    
    const config: Env = process.env as Env;
    
    return config;
}

export default validateEnv();

