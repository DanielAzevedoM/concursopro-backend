import {
  Controller,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserQuestionInteraction } from "../entities/user-question-interaction.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("review")
export class ReviewController {
  constructor(
    @InjectRepository(UserQuestionInteraction)
    private interactionRepository: Repository<UserQuestionInteraction>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getQuestionsToReview(@Request() req: { user: User }) {
    const user = req.user;

    if (user.planType !== "PRO") {
      throw new ForbiddenException(
        "A tela de revisão é exclusiva para assinantes PRO.",
      );
    }

    return this.interactionRepository.find({
      where: { userId: user.id, isReviewed: true },
      relations: ["question"],
    });
  }
}
