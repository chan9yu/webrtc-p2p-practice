# webrtc-p2p-practice

> 📚 WebRTC 기술에 대한 정리

WebRTC에 대한 내용을 정리하고 예제코드를 구현합니다.

<br />

## 🗂️ Documents

### WebRTC 이론

1. [WebRTC란?](./__documents__/1-1.webrtc-start.md)
2. [WebRTC 통신방법](./__documents__/1-2.webrtc-connection.md)

<br />

## 🚀 Getting Started

### 1. Node.js 버전 설정

`Node.js v22.14.0` 버전에서 동작합니다.
<br />
**.nvmrc** 파일이 제공되므로 **nvm**을 사용하여 아래 명령어로 버전을 맞출 수 있습니다.

```shell
# .nvmrc의 명시된 버전 설치
nvm use
```

또는 수동으로 설치하려면 공식 [Node.js 다운로드](https://nodejs.org/ko)를 참고하세요.

<br />

### 2. 패키지 매니저 설정

`pnpm`을 사용하여 패키지를 관리합니다.
<br />
`pnpm`이 설치되어 있지 않다면, 아래 명령어를 실행하세요.

```shell
# pnpm 설치
npm install -g pnpm

# pnpm 버전확인
pnpm -v
```

<br />

### 3. 프로젝트 설치 및 실행

먼저 프로젝트의 모든 의존성을 설치합니다.

```shell
pnpm install
```

이제 원하는 모드를 선택하여 실행할 수 있습니다.

#### 3.1 전체 프로젝트 실행

```shell
pnpm dev
```

위 명령어는 `frontend`와 `backend`를 동시에 실행합니다.

#### 3.2 개별 실행

`frontend`만 실행:

```shell
pnpm dev:frontend
```

`backend`만 실행:

```shell
pnpm dev:backend
```
