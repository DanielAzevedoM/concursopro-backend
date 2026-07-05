package com.concurso.api.controllers;

import com.concurso.api.models.MockExam;
import com.concurso.api.models.Question;
import com.concurso.api.models.User;
import com.concurso.api.services.MockExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/mock-exams")
public class MockExamController {

    private final MockExamService mockExamService;

    public MockExamController(MockExamService mockExamService) {
        this.mockExamService = mockExamService;
    }

    @PostMapping("/start/{categoryId}")
    public ResponseEntity<MockExam> startMockExam(
            @AuthenticationPrincipal User user,
            @PathVariable UUID categoryId) {
        return ResponseEntity.ok(mockExamService.startMockExam(user, categoryId));
    }

    @GetMapping("/questions/{categoryId}")
    public ResponseEntity<List<Question>> getMockExamQuestions(
            @PathVariable UUID categoryId,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(mockExamService.getMockExamQuestions(categoryId, limit));
    }

    @PutMapping("/finish/{mockExamId}")
    public ResponseEntity<MockExam> finishMockExam(
            @AuthenticationPrincipal User user,
            @PathVariable UUID mockExamId,
            @RequestParam int correctAnswers,
            @RequestParam int totalQuestions) {
        return ResponseEntity.ok(mockExamService.finishMockExam(user, mockExamId, correctAnswers, totalQuestions));
    }
}
