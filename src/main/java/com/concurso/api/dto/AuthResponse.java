package com.concurso.api.dto;

import com.concurso.api.enums.PlanType;

public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private PlanType planType;

    public AuthResponse(String token, String name, String email, PlanType planType) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.planType = planType;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public PlanType getPlanType() {
        return planType;
    }
}
