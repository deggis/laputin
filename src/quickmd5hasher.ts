/// <reference path="typings/main.d.ts" />

import Promise = require("bluebird");
import crypto = require("crypto");
import fs = require("fs");

import {IHasher} from "./ihasher";

var CHUNK_SIZE = 1024;

export class QuickMD5Hasher implements IHasher {

    public hash(path: string): Promise<any> {
        var done: Function;
        var promise = new Promise<File>((resolve, reject) => done = resolve);

        fs.open(path, "r", function(err, fd) {
            fs.stat(path, function(err, stats) {
                // Sometimes stats is undefined. This is probably due to file being
                // moved elsewhere or deleted.
                if (typeof stats === "undefined")
                    return;

                var input_size: number = stats.size;
                var offset: number = input_size / 2.0 - CHUNK_SIZE / 2.0;
                var buffer: Buffer = new Buffer(CHUNK_SIZE);

                try {
                    fs.read(fd, buffer, 0, buffer.length, offset, function(e, l, b) {
                        var dataForHashing = b.toString("binary");
                        var hash = crypto.createHash("md5")
                            .update(dataForHashing)
                            .digest("hex");

                        fs.close(fd);

                        done({ path: path, hash: hash });
                    });
                }
                catch (e) {
                    if (e.name === "TypeError" && e.message === "Bad argument") {
                        // If hashing is done when file is still being copied, it will
                        // fail.
                    }
                    else {
                        throw e;
                    }
                }
            });
        });

        return promise;
    }
}