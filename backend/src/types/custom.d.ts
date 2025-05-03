import { Request } from 'express';
import { Document } from "mongoose";

interface UserRequest extends Request {
    user?: Document | null;
}