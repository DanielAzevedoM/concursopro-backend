package com.concurso.api.dto;

import com.concurso.api.enums.PlanType;

public class UserResponse {
    
    private String name;
    private String email;
    private PlanType planType;

    public UserResponse(String name, String email, PlanType planType) {
        this.name = name;
        this.email = email;
        this.planType = planType;
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
