import { UseCase } from "../../compositionRoot";
import { FutureData } from "../entities/Future";
import { ExpressionType, PredictorRepository } from "../repositories/PredictorRepository";

export class ValidateExpressionUseCase implements UseCase {
    constructor(private predictorRepository: PredictorRepository) {}

    public execute(type: ExpressionType, expression: string): FutureData<string> {
        return this.predictorRepository.validateExpression(type, expression);
    }
}
