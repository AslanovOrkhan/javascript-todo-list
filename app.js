class ToDoItem {
    constructor(id, title, isDone) {
        this.id = id,
        this.title = title,
        this.isDone =isDone ?? true,
        this.createdAt = new Date() 
    }
}