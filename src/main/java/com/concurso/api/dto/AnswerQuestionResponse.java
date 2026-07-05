package com.concurso.api.dto;

public class AnswerQuestionResponse {

    private boolean correct;
    private String correctOption;
    private String explanation;
    private int remainingLives;
    private String message;

    public AnswerQuestionResponse(boolean correct, String correctOption, String explanation, int remainingLives, String message) {
        this.correct = correct;
        this.correctOption = correctOption;
        this.explanation = explanation;
        this.remainingLives = remainingLives;
        this.message = message;
    }

    // Getters
    public boolean isCorrect() {
        return correct;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public String getExplanation() {
        return explanation;
    }

    public int getRemainingLives() {
        return remainingLives;
    }

    public String getMessage() {
        return message;
    }
}
