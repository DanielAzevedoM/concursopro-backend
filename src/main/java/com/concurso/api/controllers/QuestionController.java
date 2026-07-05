package com.concurso.api.controllers;

import com.concurso.api.dto.AnswerQuestionRequest;
import com.concurso.api.dto.AnswerQuestionResponse;
import com.concurso.api.models.Question;
import com.concurso.api.models.User;
import com.concurso.api.services.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Question>> getQuestionsByCategory(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(questionService.getQuestionsByCategory(categoryId));
    }

    @PostMapping("/answer")
    public ResponseEntity<AnswerQuestionResponse> answerQuestion(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AnswerQuestionRequest request) {
        return ResponseEntity.ok(questionService.answerQuestion(user, request));
    }
}
