---
title: Hadoop 3.1.3 Windows 编译踩坑记
date: 2026-11-23
category: 功法阁
tags: Hadoop, Winutils, 大数据, 编译, Windows
summary: Hadoop 在 Windows 上跑不起来的根源不是 Hadoop，而是 winutils 与原生库。这篇把环境准备、编译依赖、常见报错与替代方案一次讲清。
author: 仙帝·Zeyan
slug: hadoop-windows-compile
pin: false
---

# Hadoop 3.1.3 Windows 编译踩坑记

> 在 Windows 上折腾 Hadoop，本质上是在跟「它从来没真正支持过 Windows」这件事和解。

Hadoop 官方发行版主要面向 Linux。想在 Windows 上跑（哪怕只是本地伪分布式学习），必须自己补上 `winutils.exe` 与 `hadoop.dll`。这篇记录踩过的坑。

## 一、先明确两条路线

| 路线 | 成本 | 适合 |
| --- | --- | --- |
| A. 用第三方编译好的 winutils | 低 | 学习、跑通 WordCount |
| B. 自己用源码 + MSVC 编译 | 高 | 需要特定版本、定制 |

**90% 的人只需要路线 A。** 网上的 winutils 仓库（按 Hadoop 版本对应）已经能覆盖 2.7/3.1/3.2/3.3。

## 二、正确放置 winutils

1. 下载与 Hadoop 版本一致的 `winutils.exe` 和 `hadoop.dll`（**版本必须匹配，否则各种诡异错误**）
2. 放到 `%HADOOP_HOME%\bin\`
3. 环境变量：
   ```
   HADOOP_HOME=D:\hadoop-3.1.3
   PATH=%HADOOP_HOME%\bin;%PATH%
   ```
4. `hadoop.dll` 再复制一份到 `C:\Windows\System32`（这一步不做，`UnsatisfiedLinkError` 一直跟着你）

验证：

```bash
hadoop version
winutils.exe ls C:\
```

## 三、五个高频报错

| 报错 | 原因 | 处理 |
| --- | --- | --- |
| `Could not locate executable null\bin\winutils.exe` | `HADOOP_HOME` 未设置或含空格 | 设置环境变量；路径不要带空格 |
| `UnsatisfiedLinkError: org.apache.hadoop.io.nativeio.NativeIO` | `hadoop.dll` 没进 System32 | 复制 dll 到 System32 |
| `Permission denied: user=...` | 缺少 HDFS 目录权限 | `winutils.exe chmod 777 /tmp` |
| `ExitCodeException exitCode=1` | winutils 版本不匹配 | 换对应版本 |
| 中文乱码 | 控制台编码非 UTF-8 | `chcp 65001` |

## 四、如果要自己编译

所需工具链（Hadoop 3.1.3）：

- JDK 8（**不要 JDK 11+，编译脚本会挂**）
- Maven 3.x
- CMake 3.x
- Visual Studio（对应 MSVC 版本）
- Protocol Buffers **2.5.0**（版本强绑定，用 3.x 必失败）
- zlib / openssl 开发库

编译命令：

```bash
mvn package -Pdist,native-win -DskipTests -Dtar
```

然后从 `hadoop-dist/target/` 取出 `bin` 下的原生文件。

**最劝退的两点**：protobuf 2.5.0 在新系统上编译本身就有兼容问题；MSVC 与 Windows SDK 版本敏感。所以我最终的结论是——**能用预编译就用预编译**。

## 五、更省事的三个替代方案

1. **Docker**：`docker run -it sequenceiq/hadoop-docker` 直接跑，Windows 上最省心
2. **WSL2**：Ubuntu 里装 Hadoop，体验接近生产
3. **单机 Spark**：如果只是学 MapReduce 思路，Spark local 模式足够

我现在做大数据相关的实验，基本都在 WSL2 或 Docker 里，Windows 原生环境只用来跑 `winutils` 相关的小工具。

## 六、验证跑通

```bash
hdfs namenode -format
start-dfs.cmd
hdfs dfs -mkdir -p /user/test/input
hdfs dfs -put README.txt /user/test/input
hadoop jar %HADOOP_HOME%\share\hadoop\mapreduce\hadoop-mapreduce-examples-3.1.3.jar wordcount /user/test/input /user/test/output
hdfs dfs -cat /user/test/output/part-r-00000
```

看到词频输出，就说明 winutils 链路全通了。

## 结语

Windows 上的 Hadoop 不是「装不上」，而是「要多配一步」。记住优先级：**版本匹配的 winutils → dll 进 System32 → 路径无空格**，八成问题当场解决；剩下的八成，换 WSL2 更快。

---

*相关：[Docker 容器化部署实战](https://www.juxingspacestation.top/article/docker-deployment-guide)*
