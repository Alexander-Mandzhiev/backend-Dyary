import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "prisma/generated/client";

export class UpdateUserResponce {
    @ApiProperty({ description: 'Email пользователя', example: "Password@123" })
    email: string;
    @ApiProperty({ description: 'Имя пользователя', example: "admin" })
    username: string;
}

export class UserResponse extends UpdateUserResponce {
    @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;

}

export class User extends UserResponse {
    @ApiProperty({ description: 'Пароль пользователя', example: "Password@123" })
    password: string;
}

export class AuthTokensResponse {
    @ApiProperty({ description: 'Токен пользовтеля', example: "eyJhbGciOiJ..." })
    accessToken: string;
    @ApiProperty({ description: 'Обновление токена пользовтеля', example: "eyJhbGciO..." })
    refreshToken: string;
}

export class AuthResponse extends AuthTokensResponse {
    user: UserResponse;
}

export class SignInResponse {
    @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;
    @ApiProperty({ description: 'Email пользователя', example: "Password@123" })
    email: string;
    @ApiProperty({ description: 'Имя пользователя', example: "username" })
    username: string;
    @ApiProperty({ description: 'Токен пользовтеля', example: "eyJhbGciOiJ..." })
    accessToken: string;
}

export class UserAndTasksResponce extends User {
    tasks: TaskResponse[]
}

export class StatisticResponse {
    @ApiProperty({ description: 'Название поля статистики', example: "Total" })
    label: string;
    @ApiProperty({ description: 'Число задач', example: "10" })
    value: number;
}

export class UserProfileResponse {
    @ApiProperty()
    user: UserAndTasksResponce;
    @ApiProperty()
    statistic: StatisticResponse;
}

export class TaskResponse {
    @ApiProperty({ description: 'Уникальный идентификатор задачи', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt?: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;
    @ApiProperty({ description: 'Название задачи', example: "Выпить кофе" })
    name: string;
    @ApiProperty({ description: 'Приоритет задачи', example: "low, medium, high" })
    priority?: $Enums.Priority;
    @ApiProperty({ description: 'Выполнена ли задача', example: "true, false" })
    isCompleted?: boolean;
    @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: "clssw6joa000030ntu3j61b35" })
    userId: string;
}

export class TimeBlockResponse {
    @ApiProperty({ description: 'Уникальный идентификатор временного блока', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;
    @ApiProperty({ description: 'Название временного блока', example: "Выпить кофе" })
    name: string;
    @ApiProperty({ description: 'Цвет временного блока', example: "red" })
    color: string;
    @ApiProperty({ description: 'Длительность временного блока', example: '30' })
    duration: number;
    @ApiProperty({ description: 'Порядок очереди', example: '2' })
    order: number;
    @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: "clssw6joa000030ntu3j61b35" })
    userId: string;
}

export class TimeBlockOrderingReqest {
    @ApiProperty({ description: "Передается массив id временных блоков для изменения их порядка очереди", example: { "ids": ["clsvrkkt7000413vn8msc42gr", "..."] } })
    ids: string[]
}

export class SessionResponse {
    @ApiProperty({ description: 'Уникальный идентификатор сессии пользователя', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;
    @ApiProperty({ description: 'Сессия завершена или нет', example: "true, false" })
    isCompleted: boolean;
    @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: "clssw6joa000030ntu3j61b35" })
    userId: string;

}
export class SessionRoundResponse {
    @ApiProperty({ description: 'Уникальный идентификатор раунда временного блока', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;
    @ApiProperty({ description: 'Пройден ли раунд сессии', example: "true" })
    isCompleted: boolean;
    @ApiProperty({ description: 'Уникальный идентификатор сессии', example: "1" })
    userSessionId: string;
    @ApiProperty({ description: 'Общее количество секунд в раунде', example: "1" })
    totalSeconds: number;
}

export class UserSessionResponse extends SessionResponse {
    rounds: SessionRoundResponse[];
}


export class SettingsResponse {
    @ApiProperty({ description: 'Уникальный идентификатор раунда временного блока', example: "1" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
    @ApiProperty({ description: 'Дата обновления пользователя', example: '2023-06-29T11:35:09.918Z' })
    updatedAt: Date;
    @ApiProperty({ description: 'Время работы', example: '45' })
    workInterval: number;
    @ApiProperty({ description: 'Перерыв', example: '15' })
    breakInterval: number;
    @ApiProperty({ description: 'Количество интервалов', example: 'red' })
    intervalsCount: number;
    @ApiProperty({ description: 'Уникальный идентификатор пользователя', example: "clssw6joa000030ntu3j61b35" })
    userId: string;
}

export class DeleteMessage {
    @ApiProperty({ description: 'Сообщение об удалении', example: "Задача удалена!" })
    message: string
}