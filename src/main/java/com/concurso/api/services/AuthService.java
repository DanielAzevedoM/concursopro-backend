package com.concurso.api.services;

import com.concurso.api.dto.AuthResponse;
import com.concurso.api.dto.UserResponse;
import com.concurso.api.dto.LoginRequest;
import com.concurso.api.dto.RegisterRequest;
import com.concurso.api.enums.PlanType;
import com.concurso.api.models.User;
import com.concurso.api.repositories.UserRepository;
import com.concurso.api.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPlanType(PlanType.FREE);
        user.setDailyErrors(0);
        user.setLastErrorReset(LocalDate.now());

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken, user.getName(), user.getEmail(), user.getPlanType());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken, user.getName(), user.getEmail(), user.getPlanType());
    }

    public UserResponse getMe(User user) {
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return new UserResponse(freshUser.getName(), freshUser.getEmail(), freshUser.getPlanType());
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com este e-mail"));

        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetCode(code);
        user.setResetCodeExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        System.out.println("\n=================================================");
        System.out.println("CÓDIGO DE RECUPERAÇÃO PARA " + email + ": " + code);
        System.out.println("=================================================\n");
    }

    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (user.getResetCode() == null || !user.getResetCode().equals(code)) {
            throw new RuntimeException("Código inválido");
        }

        if (user.getResetCodeExpiry() == null || user.getResetCodeExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Código expirado. Solicite um novo código.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        userRepository.save(user);
    }
}
