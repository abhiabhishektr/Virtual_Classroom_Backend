/backend
├── src
│   ├── main
│   │   ├── server.ts
│   │   └── app.ts
│   ├── infrastructure
│   │   └── database
│   │       └── mongoDB.ts
│   ├── interfaces
│   │   ├── middlewares
│   │   │   └── errorHandler.ts
│   │   │   └── authMiddleware.ts
│   │   ├── routes
│   │   │   ├── authenticationRoutes.ts
│   │   │   ├── profileRoutes.ts
│   │   │   ├── classroomRoutes.ts
│   │   │   └── notificationRoutes.ts
│   │   └── controllers
│   │       ├── authenticationController.ts
│   │       ├── profileController.ts
│   │       ├── classroomController.ts
│   │       └── notificationController.ts
│   └── application
│       ├── use-cases
│       │   ├── authentication
│       │   │   ├── loginUser.ts
│       │   │   ├── logoutUser.ts
│       │   │   ├── registerUser.ts
│       │   │   └── verifyOTP.ts
│       │   └── profile
│       │       ├── viewProfile.ts
│       │       └── editProfile.ts
│       ├── services
│       │   ├── notificationService.ts
│       │   └── chatService.ts
│       └── repositories
│           ├── userRepository.ts
│           ├── teacherRepository.ts
│           └── classroomRepository.ts
├── .env
├── package.json
└── tsconfig.json
