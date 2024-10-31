/**
 * Copyright (C) 2023 Arm Limited
 */

declare namespace FS {
    function mkdirTree(path: string, mode?: number): any;
    function analyzePath(path: string): any;
    function ErrnoError(): void;
}

interface Module extends EmscriptenModule {
    FS: typeof FS;
    ERRNO_CODES: { [key: string]: string };
    _main(argc: number, argv: number): number;
    allocateUTF8(value: string): number;
}

type ModuleFactory = EmscriptenModuleFactory<Module>;
