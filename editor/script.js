// 비밀번호 확인 후 수정 가능하게 하는 함수
function checkPassword() {
  const password = prompt("암호를 입력하세요:");
  if (password === "1234") {
    document.querySelector("table").contentEditable = true;
    document.querySelector("button[onclick='saveChanges()']").style.display =
      "inline";
  } else {
    alert("암호가 틀렸습니다.");
  }
}

// GitHub에 변경 사항 저장
async function saveChanges() {
  const content = document.documentElement.outerHTML; // 페이지 전체 HTML 내용 가져오기
  const encodedContent = btoa(unescape(encodeURIComponent(content))); // 내용 인코딩

  const githubToken = "YOUR_GITHUB_TOKEN"; // 실제 토큰을 여기에 넣어야 해
  const repoOwner = "onomlight";
  const repoName = "1Hstart";
  const filePath = "today/monday.html"; // 여기에 파일 경로 (예시로 monday.html 사용)

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  try {
    // 파일 정보 가져오기
    const response = await fetch(url, {
      headers: { Authorization: `token ${githubToken}` },
    });

    if (!response.ok) {
      alert("GitHub에서 파일 정보를 가져오는 데 실패했습니다.");
      return;
    }

    const fileData = await response.json();

    // 커밋 메시지 및 파일 업데이트 데이터 준비
    const commitData = {
      message: "자동 업데이트: monday.html",
      content: encodedContent,
      sha: fileData.sha, // 기존 파일의 SHA값 필요
    };

    // 파일 업데이트 요청
    const updateResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commitData),
    });

    const updateJson = await updateResponse.json();

    if (updateResponse.ok) {
      alert("수정된 내용이 GitHub에 업로드되었습니다!");
      location.reload(); // 페이지 새로 고침
    } else {
      alert("업로드 실패! API 응답 확인 필요");
    }
  } catch (error) {
    console.error("업데이트 중 오류 발생:", error);
    alert("GitHub에 업데이트하는 중 오류가 발생했습니다.");
  }
}
