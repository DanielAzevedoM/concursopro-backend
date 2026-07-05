package com.concurso.api.controllers;

import com.concurso.api.models.User;
import com.concurso.api.repositories.MockExamRepository;
import com.concurso.api.repositories.UserQuestionInteractionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserQuestionInteractionRepository interactionRepository;
    private final MockExamRepository mockExamRepository;

    public DashboardController(UserQuestionInteractionRepository interactionRepository, MockExamRepository mockExamRepository) {
        this.interactionRepository = interactionRepository;
        this.mockExamRepository = mockExamRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardMetrics(@AuthenticationPrincipal User user) {
        Map<String, Object> metrics = new HashMap<>();

        long totalQuestionsSolved = interactionRepository.findByUserId(user.getId()).size();
        long totalQuestionsCorrect = interactionRepository.countByUserIdAndIsCorrectTrue(user.getId());
        long totalQuestionsReviewed = interactionRepository.findByUserIdAndIsReviewedTrue(user.getId()).size();
        long totalMockExamsCompleted = mockExamRepository.findByUserId(user.getId()).size();

        metrics.put("planType", user.getPlanType());
        metrics.put("dailyErrors", user.getDailyErrors());
        metrics.put("totalQuestionsSolved", totalQuestionsSolved);
        metrics.put("totalQuestionsCorrect", totalQuestionsCorrect);
        metrics.put("totalQuestionsReviewed", totalQuestionsReviewed);
        metrics.put("totalMockExamsCompleted", totalMockExamsCompleted);

        return ResponseEntity.ok(metrics);
    }
}
