package com.concurso.api.services;

import com.concurso.api.enums.PlanType;
import com.concurso.api.models.Category;
import com.concurso.api.models.MockExam;
import com.concurso.api.models.Question;
import com.concurso.api.models.User;
import com.concurso.api.repositories.CategoryRepository;
import com.concurso.api.repositories.MockExamRepository;
import com.concurso.api.repositories.QuestionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MockExamService {

    private final MockExamRepository mockExamRepository;
    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;

    public MockExamService(MockExamRepository mockExamRepository, QuestionRepository questionRepository, CategoryRepository categoryRepository) {
        this.mockExamRepository = mockExamRepository;
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    public MockExam startMockExam(User user, UUID categoryId) {
        if (user.getPlanType() != PlanType.PRO) {
            throw new RuntimeException("Simulados são exclusivos para assinantes PRO.");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        MockExam mockExam = new MockExam();
        mockExam.setUser(user);
        mockExam.setCategory(category);
        return mockExamRepository.save(mockExam);
    }

    public List<Question> getMockExamQuestions(UUID categoryId, int limit) {
        return questionRepository.findRandomQuestionsByCategory(categoryId, limit);
    }

    public MockExam finishMockExam(User user, UUID mockExamId, int correctAnswers, int totalQuestions) {
        MockExam mockExam = mockExamRepository.findById(mockExamId)
                .orElseThrow(() -> new RuntimeException("Simulado não encontrado"));

        if (!mockExam.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Simulado não pertence a este usuário");
        }

        mockExam.setFinishedAt(LocalDateTime.now());
        mockExam.setCorrectAnswers(correctAnswers);
        mockExam.setTotalQuestions(totalQuestions);

        return mockExamRepository.save(mockExam);
    }
}
