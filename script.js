document.addEventListener('DOMContentLoaded', function () {
    const teacherSelect = document.getElementById('teacher');
    const savedTeachers = JSON.parse(localStorage.getItem('teachers')) || [];

    // 加载保存的教师列表
    if (savedTeachers.length === 0) {
        teacherSelect.innerHTML = '<option value="" disabled selected>暂无教师，请添加</option>';
    } else {
        savedTeachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher;
            option.textContent = teacher;
            teacherSelect.appendChild(option);
        });
    }

    // 加载保存的评论记录
    const reviewsDiv = document.getElementById('reviews');
    const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    if (savedReviews.length === 0) {
        reviewsDiv.innerHTML = '<p>暂无评论。</p>';
    } else {
        reviewsDiv.innerHTML = '';
        savedReviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.innerHTML = `
                <p><strong>教师：</strong>${review.teacher}</p>
                <p><strong>评分：</strong>${review.rating}</p>
                <p><strong>评论：</strong>${review.comment}</p>
                <hr>
            `;
            reviewsDiv.appendChild(reviewItem);
        });
    }
});

// 添加教师按钮逻辑
document.getElementById('addTeacherBtn').addEventListener('click', function () {
    const newTeacherInput = document.getElementById('newTeacherInput');
    const newTeacherName = newTeacherInput.value.trim();
    const teacherSelect = document.getElementById('teacher');

    if (newTeacherName) {
        // 更新下拉菜单
        const option = document.createElement('option');
        option.value = newTeacherName;
        option.textContent = newTeacherName;
        teacherSelect.appendChild(option);

        // 更新 Local Storage
        const savedTeachers = JSON.parse(localStorage.getItem('teachers')) || [];
        savedTeachers.push(newTeacherName);
        localStorage.setItem('teachers', JSON.stringify(savedTeachers));

        // 清空输入框
        newTeacherInput.value = '';
        alert('教师已添加！');
    } else {
        alert('请输入教师名称！');
    }
});

// 提交评论逻辑
document.getElementById('ratingForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const teacher = document.getElementById('teacher').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('comment').value;

    if (!teacher) {
        alert('请选择教师！');
        return;
    }

    const newReview = { teacher, rating, comment };

    // 更新评论记录
    const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    savedReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(savedReviews));

    // 显示新的评论
    const reviewsDiv = document.getElementById('reviews');
    const reviewItem = document.createElement('div');
    reviewItem.innerHTML = `
        <p><strong>教师：</strong>${teacher}</p>
        <p><strong>评分：</strong>${rating}</p>
        <p><strong>评论：</strong>${comment}</p>
        <hr>
    `;
    reviewsDiv.appendChild(reviewItem);

    alert('感谢您的反馈！');
    this.reset();
});
document.getElementById('clearStorageBtn').addEventListener('click', function () {
    if (confirm('确定要清除所有数据吗？此操作无法撤销！')) {
        localStorage.clear();
        alert('所有数据已清除！');
        location.reload(); // 刷新页面以更新显示
    }
});