package com.concurso.api.controllers;

import com.concurso.api.enums.PlanType;
import com.concurso.api.models.User;
import com.concurso.api.models.UserQuestionInteraction;
import com.concurso.api.repositories.UserQuestionInteractionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    private final UserQuestionInteractionRepository interactionRepository;

    public ReviewController(UserQuestionInteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserQuestionInteraction>> getQuestionsToReview(@AuthenticationPrincipal User user) {
        if (user.getPlanType() != PlanType.PRO) {
            throw new RuntimeException("A tela de revisão é exclusiva para assinantes PRO.");
        }
        
        List<UserQuestionInteraction> reviews = interactionRepository.findByUserIdAndIsReviewedTrue(user.getId());
        return ResponseEntity.ok(reviews);
    }
}
