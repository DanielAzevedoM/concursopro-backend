package com.concurso.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class AnswerQuestionRequest {

    private UUID questionId;

    @NotBlank(message = "A alternativa selecionada é obrigatória")
    private String selectedOption; // 'A', 'B', 'C', etc.

    // Getters and Setters
    public UUID getQuestionId() {
        return questionId;
    }

    public void setQuestionId(UUID questionId) {
        this.questionId = questionId;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
