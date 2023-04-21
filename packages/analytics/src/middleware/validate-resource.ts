import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
// import * as debug from 'debug';
// const log = debug('app:validate');

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params, 
        })
        next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any){
        return res.status(400).send(error.errors);
    }
}

export default validateResource;
