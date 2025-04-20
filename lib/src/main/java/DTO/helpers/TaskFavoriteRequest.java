package DTO.helpers;

public record TaskFavoriteRequest(
        Long userId,
        Long taskId,
        boolean favorite
) { }
