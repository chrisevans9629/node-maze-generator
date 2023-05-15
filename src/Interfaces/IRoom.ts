import { IDirection } from "./IDirection";

export interface IRoomTemplate {
    door: string;
    title: string;
    count: number;
    isFinite: boolean;
    color: string;
}

export interface IRoom extends IDirection {
    door: string;
    title: string;
    color: string;
}
