import { mulberry32 } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";

export interface ISelector {
    Create(dir: IDirection): void;
    GetItem<Type>(data: Type[]): Type;
    Get(): number;
}

export class RandomSelector implements ISelector
{
    seed: number;
    rng: () => number;
    constructor(seed: number){
        this.seed = seed;
        this.rng = () => {
            throw "create was not ran";
        };
    }
    Create(dir: IDirection): void {
        this.rng = mulberry32(dir.x * 7 + dir.y * 77 + dir.z * 777 + this.seed);
    }

    GetItem<Type>(data:Type[]): Type {
        let ii = Math.floor(this.rng() * data.length);
        return data[ii];
    }

    Get(): number {
        return this.rng();
    }
}

export class MockSelector implements ISelector {
    Index: number = 0;
    Create(_dir: IDirection): void {

    }
    GetItem<Type>(data: Type[]): Type {
        return data[this.Index];
    }

    Get() {
        return this.Index;
    }

}