import './style/bundle.css';
import { HTMLBuilder as builder } from './tool/HTMLBuilder';
import { TaskService } from './service/task-service';
import { Task } from './model/task';

let TASK_LIST: Array<Task> = new Array<Task>();

window.onload = function() {
  loadTasks();
  document.getElementById('addTaskBtn').onclick = addTask;
  document.getElementById('inputTaskLabel').onkeyup = event => {
    if (event.keyCode == 13) {
      addTask();
    }
  };
};

function addTask() {
  const inputLabel: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('inputTaskLabel')
  );

  let copyOfValue = inputLabel.value;

  if (
    inputLabel.value != undefined &&
    inputLabel.value != '' &&
    inputLabel.value &&
    copyOfValue.replace(/ /g, '').length != 0
  ) {
    let task: Task = new Task();

    TASK_LIST.sort((a, b) => {
      return Number(a.id) > Number(b.id) ? 1 : -1;
    });

    if (TASK_LIST[TASK_LIST.length - 1]) {
      task.id = String(Number.parseInt(TASK_LIST[TASK_LIST.length - 1].id) + 1);
    } else {
      task.id = '1';
    }

    console.log(TASK_LIST);

    task.text = inputLabel.value;
    task.isDone = false;

    TaskService.saveTask(task)
      .then(response => {
        loadTasks();
        inputLabel.value = '';
      })
      .catch(err => {
        console.log(err);
        loadTasks();
      });
  }
}

function deleteTask(id: string) {
  TaskService.deleteTask(id)
    .then(response => {
      loadTasks();
    })
    .catch(err => {
      alert('Unfortunetely task cannot be deleted. Try again later.');
    });
}

function toggleTask(id: string) {
  TaskService.getTaskById(id)
    .then(response => {
      let taskToEdit: Task = response.data;
      taskToEdit.isDone = !taskToEdit.isDone;
      TaskService.toggleTask(taskToEdit)
        .then(() => {
          loadTasks();
        })
        .catch(err => {
          alert('Problem with toggling!');
        });
    })
    .catch(err => {
      loadTasks();
      alert('Cannot toggle task with id="' + id + '"!\nError: ' + err);
    });
}

function loadTasks(): void {
  const container: HTMLElement = document.getElementById('container');
  TASK_LIST.splice(0, TASK_LIST.length);

  TaskService.getTasks()
    .then(response => {
      container.innerHTML = '';

      if (response.data.length == 0) {
        container.innerHTML = 'Task list is empty.';
      } else {
        response.data.forEach((task: Task) => {
          TASK_LIST.push(task);

          container.innerHTML += builder.createHTMLElement(
            'div',
            '',
            'subcontainer',
            builder.createHTMLElement(
              'div',
              'task' + task.id,
              'taskContainer',
              `Task: ${JSON.stringify(task)} <button id="toggleTask${
                task.id
              }" class="toggleTaskBtn">${toggleTaskText(
                task
              )}</button> <button id="deleteTask${
                task.id
              }" class="deleteTaskBtn">Delete</button>`
            )
          );
        });

        response.data.forEach((task: Task) => {
          let deleteButton: HTMLElement = document.getElementById(
            'deleteTask' + task.id
          );

          deleteButton.onclick = () => {
            deleteTask(task.id);
          };

          let toggleButton: HTMLElement = document.getElementById(
            'toggleTask' + task.id
          );

          toggleButton.onclick = () => {
            toggleTask(task.id);
          };
        });
      }
    })
    .catch(err => {
      container.innerHTML = '';
      container.innerHTML += builder.createHTMLElement(
        'div',
        'taskError',
        'taskError',
        `Unfortunetely something went wrong. Try again later! <br/> ${err}`
      );
    });
}

function toggleTaskText(task: Task): string {
  if (task.isDone) {
    return 'Undo!';
  } else if (!task.isDone) {
    return 'Do!';
  }
}
