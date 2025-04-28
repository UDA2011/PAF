package com.example.skillfy.dtos;

public record TokenDto(
        String accessToken,
        String refreshToken,
        Long expiresIn
) {
}
