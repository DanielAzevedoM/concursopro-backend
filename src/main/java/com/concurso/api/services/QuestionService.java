package com.concurso.api.services;

import com.concurso.api.dto.AnswerQuestionRequest;
import com.concurso.api.dto.AnswerQuestionResponse;
import com.concurso.api.enums.PlanType;
import com.concurso.api.models.Question;
import com.concurso.api.models.User;
import com.concurso.api.models.UserQuestionInteraction;
import com.concurso.api.repositories.QuestionRepository;
import com.concurso.api.repositories.UserQuestionInteractionRepository;
import com.concurso.api.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class QuestionService {

    private static final int MAX_DAILY_ERRORS_FREE = 5;

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final UserQuestionInteractionRepository interactionRepository;

    public QuestionService(QuestionRepository questionRepository, UserRepository userRepository, UserQuestionInteractionRepository interactionRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.interactionRepository = interactionRepository;
    }

    public List<Question> getQuestionsByCategory(UUID categoryId) {
        return questionRepository.findByCategoryId(categoryId);
    }

    public AnswerQuestionResponse answerQuestion(User user, AnswerQuestionRequest request) {
        // Verifica reset de erros diários
        if (!user.getLastErrorReset().isEqual(LocalDate.now())) {
            user.setDailyErrors(0);
            user.setLastErrorReset(LocalDate.now());
            userRepository.save(user);
        }

        // Bloqueio Free Plan
        if (user.getPlanType() == PlanType.FREE && user.getDailyErrors() >= MAX_DAILY_ERRORS_FREE) {
            throw new RuntimeException("Você atingiu o limite de " + MAX_DAILY_ERRORS_FREE + " erros diários no plano gratuito. Assine o Pro ou tente amanhã.");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Questão não encontrada"));

        boolean isCorrect = question.getCorrectOption().equalsIgnoreCase(request.getSelectedOption());

        if (!isCorrect && user.getPlanType() == PlanType.FREE) {
            user.setDailyErrors(user.getDailyErrors() + 1);
            userRepository.save(user);
        }

        // Salva a interação
        UserQuestionInteraction interaction = new UserQuestionInteraction();
        interaction.setUser(user);
        interaction.setQuestion(question);
        interaction.setCorrect(isCorrect);
        // Pode ser marcada para revisão em outra rota, ou aqui mesmo se quiser
        interactionRepository.save(interaction);

        int remainingLives = (user.getPlanType() == PlanType.FREE) ? (MAX_DAILY_ERRORS_FREE - user.getDailyErrors()) : -1;
        String message = isCorrect ? "Resposta correta!" : "Resposta incorreta.";

        return new AnswerQuestionResponse(
                isCorrect,
                question.getCorrectOption(),
                question.getExplanation(),
                remainingLives,
                message
        );
    }
}
