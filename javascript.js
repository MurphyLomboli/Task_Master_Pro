window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const datetimeInput = document.querySelector("#new-task-datetime");
    const list_el = document.querySelector("#tasks");

    // Load tasks from localStorage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(savedTask => {
        createTaskElement(savedTask.task, savedTask.datetime);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;
        const datetime = datetimeInput.value;

        if (!task || !datetime) {
            alert("Please enter a task and select a date and time!");
            return;
        }

        // Check if the task is already in the list before creating a new one
        if (!isTaskInList(task, datetime)) {
            // Create task element and save to localStorage
            createTaskElement(task, datetime);
        }

        // Clear form inputs after adding the task
        input.value = "";
        datetimeInput.value = "";
 
    });

    function createTaskElement(task, datetime) {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = task + " (Due: " + datetime + ")";
        task_input_el.setAttribute("readonly", "readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        // Save task to localStorage
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.push({ task, datetime });
        localStorage.setItem('tasks', JSON.stringify(savedTasks));

        task_edit_el.addEventListener('click', () => {
            if (task_edit_el.innerText.toLowerCase() == "edit") {
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
                task_edit_el.innerText = "Save";
            } else {
                task_input_el.setAttribute("readonly", "readonly");
                task_edit_el.innerText = "Edit";
            }
        });

        task_delete_el.addEventListener('click', () => {
            // Remove task from localStorage and update the display
            const updatedTasks = savedTasks.filter(savedTask => savedTask.task !== task || savedTask.datetime !== datetime);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            list_el.removeChild(task_el);
        });
    }

    function isTaskInList(task, datetime) {
        // Check if the task is already in the list
        const existingTasks = Array.from(list_el.querySelectorAll(".text"));
        return existingTasks.some(taskInput => taskInput.value === task + " (Due: " + datetime + ")");
    }
});