export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        uri: process.env.DATABASE_URI,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        name: process.env.POSTGRES_DATABASE,
    },
    keys: {
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
        publicKey: process.env.PUBLIC_KEY.replace(/\\n/gm, '\n'),
    },
});
