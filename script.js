// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgFE8-KCA0pLUz6TXWRJmGK4hS3DhkXe0",
    authDomain: "rate-my-teacher-jlhs.firebaseapp.com",
    databaseURL: "https://rate-my-teacher-jlhs-default-rtdb.firebaseio.com",
    projectId: "rate-my-teacher-jlhs",
    storageBucket: "rate-my-teacher-jlhs.firebasestorage.app",
    messagingSenderId: "796156044882",
    appId: "1:796156044882:web:f1f71d607e1a2912c1e18b",
    measurementId: "G-7HTQBBZNC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 添加教师并检查重复
document.getElementById('addTeacherBtn').addEventListener('click', () => {
    const newTeacherInput = document.getElementById('newTeacherInput');
    const newTeacherName = newTeacherInput.value.trim();
    if (!newTeacherName) {
        alert('请输入教师名称！');
        return;
    }

    const teachersRef = ref(database, 'teachers');
    onValue(teachersRef, (snapshot) => {
        const teachers = snapshot.val() || {};
        const teacherNames = Object.values(teachers);

        if (teacherNames.includes(newTeacherName)) {
            alert('教师已存在！');
        } else {
            push(teachersRef, newTeacherName)
                .then(() => {
                    newTeacherInput.value = '';
                    alert('教师已添加！');
                })
                .catch((error) => {
                    console.error("添加教师失败:", error);
                    alert('无法添加教师，请稍后重试！');
                });
        }
    }, { onlyOnce: true });
});

// 加载教师列表
const teacherSelect = document.getElementById('teacher');
onValue(ref(database, 'teachers'), (snapshot) => {
    teacherSelect.innerHTML = '<option value="" disabled selected>请选择教师</option>';
    const teachers = snapshot.val();
    if (teachers) {
        Object.values(teachers).forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher;
            option.textContent = teacher;
            teacherSelect.appendChild(option);
        });
    }
});

// 提交评论
document.getElementById('ratingForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const teacher = document.getElementById('teacher').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('comment').value;

    if (!teacher) {
        alert('请选择教师！');
        return;
    }

    const newReviewRef = push(ref(database, 'reviews'));
    set(newReviewRef, {
        teacher: teacher,
        rating: parseInt(rating, 10),
        comment: comment,
        timestamp: Date.now()
    })
    .then(() => {
        alert('感谢您的反馈！');
        this.reset();
    })
    .catch((error) => {
        console.error("评论提交失败:", error);
        alert('无法提交评论，请稍后重试！');
    });
});

// 加载评论
const reviewsDiv = document.getElementById('reviews');
const teacherRatingsDiv = document.getElementById('teacherRatings');
onValue(ref(database, 'reviews'), (snapshot) => {
    reviewsDiv.innerHTML = '';
    const reviews = snapshot.val();
    const teacherScores = {};

    if (!reviews) {
        reviewsDiv.innerHTML = '<p>暂无评论。</p>';
        teacherRatingsDiv.innerHTML = '<p>暂无数据。</p>';
        return;
    }

    for (let id in reviews) {
        const review = reviews[id];
        const reviewItem = document.createElement('div');
        reviewItem.innerHTML = `
            <p><strong>教师：</strong>${review.teacher}</p>
            <p><strong>评分：</strong>${review.rating}</p>
            <p><strong>评论：</strong>${review.comment}</p>
            <hr>
        `;
        reviewsDiv.appendChild(reviewItem);

        // 统计每位教师的评分
        if (!teacherScores[review.teacher]) {
            teacherScores[review.teacher] = [];
        }
        teacherScores[review.teacher].push(review.rating);
    }

    // 计算平均分并显示
    teacherRatingsDiv.innerHTML = '';
    Object.entries(teacherScores).forEach(([teacher, scores]) => {
        const average = (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2);
        const teacherItem = document.createElement('div');
        teacherItem.innerHTML = `<p>${teacher}: 平均分 ${average}</p>`;
        teacherRatingsDiv.appendChild(teacherItem);
    });
});
