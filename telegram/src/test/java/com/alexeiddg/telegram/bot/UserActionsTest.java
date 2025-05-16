import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.alexeiddg.telegram.bot.actions.task.CreateTaskAbility;
import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempTaskDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.SprintService;
import com.alexeiddg.telegram.service.TaskLogService;
import com.alexeiddg.telegram.service.TaskService;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import enums.UserRole;
import model.AppUser;
import model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.sender.SilentSender;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.User;

import java.time.LocalDateTime;
import java.util.Optional;

public class UserActionsTest {

    private CreateTaskAbility createTaskAbility;

    private UserSessionManager userSessionManager;
    private AppUserService appUserService;
    private TempTaskDataStore tempTaskDataStore;
    private SprintService sprintService;
    private TaskService taskService;
    private TaskLogService taskLogService;
    private BaseAbilityBot bot;
    private SilentSender silentSender;

    @BeforeEach
    public void setup() {
        userSessionManager = mock(UserSessionManager.class);
        appUserService = mock(AppUserService.class);
        tempTaskDataStore = mock(TempTaskDataStore.class);
        sprintService = mock(SprintService.class);
        taskService = mock(TaskService.class);
        taskLogService = mock(TaskLogService.class);
        bot = mock(BaseAbilityBot.class);

        silentSender = mock(SilentSender.class);
        when(bot.silent()).thenReturn(silentSender); 

        createTaskAbility = new CreateTaskAbility(
            userSessionManager,
            appUserService,
            tempTaskDataStore,
            sprintService,
            taskService,
            taskLogService
        );
    }

    private Update createUpdate(String text, Long userId, Long chatId) {
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);

        Message message = mock(Message.class);
        when(message.hasText()).thenReturn(true);
        when(message.getText()).thenReturn(text);
        when(message.getFrom()).thenReturn(user);
        when(message.getChatId()).thenReturn(chatId);

        Update update = mock(Update.class);
        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);

        return update;
    }

    @Test
    public void testHandleCreateTask_TaskCreateName_SetsTaskName() {
        Long telegramId = 12345L;
        Long chatId = 54321L;

        Task task = new Task();
        when(userSessionManager.getState(telegramId)).thenReturn(UserState.TASK_CREATE_NAME);
        when(tempTaskDataStore.get(telegramId)).thenReturn(task);

        Update update = createUpdate("My Task Name", telegramId, chatId);

        createTaskAbility.handleCreateTask(bot, update);

        // Verificamos que el nombre se haya seteado
        assertEquals("My Task Name", task.getTaskName());

        // Verificamos que se haya actualizado el task en temp storage
        verify(tempTaskDataStore).set(telegramId, task);

        // Verificamos que el estado cambió a TASK_CREATE_DESCRIPTION
        verify(userSessionManager).setState(telegramId, UserState.TASK_CREATE_DESCRIPTION);

        // Verificamos que se haya enviado el mensaje para descripción
        verify(silentSender).send("Please enter the task description:", chatId); 
    }

    // Aquí puedes agregar más tests para cada paso del switch-case...

}
