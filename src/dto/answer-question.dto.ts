import { IsString, IsUUID } from "class-validator";

export class AnswerQuestionDto {
  @IsUUID()
  questionId: string;

  @IsString()
  selectedOption: string;
}
