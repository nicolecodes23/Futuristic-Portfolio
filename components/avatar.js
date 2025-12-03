document.addEventListener("mousemove", (event) => {
    const face = document.querySelector('.face');
    const faceRect = face.getBoundingClientRect();
    const faceCenterX = faceRect.left + faceRect.width / 2;
    const faceCenterY = faceRect.top + faceRect.height / 2;

    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
        const eyeRect = eye.getBoundingClientRect();

        const angleX = (event.clientX - faceCenterX) / (faceRect.width / 2);
        const angleY = (event.clientY - faceCenterY) / (faceRect.height / 2);

        const maxMove = 1; // 
        const moveX = angleX * maxMove;
        const moveY = angleY * maxMove;

        eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});
