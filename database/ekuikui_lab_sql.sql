-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 19-Maio-2026 às 02:45
-- Versão do servidor: 5.7.24
-- versão do PHP: 7.2.14

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ekuikui_lab`
--
CREATE DATABASE IF NOT EXISTS `ekuikui_lab` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ekuikui_lab`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `alocacoes`
--

DROP TABLE IF EXISTS `alocacoes`;
CREATE TABLE IF NOT EXISTS `alocacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_nome` varchar(100) NOT NULL,
  `disciplina` varchar(100) NOT NULL,
  `turma_nome` varchar(50) NOT NULL,
  `num_alunos` int(11) NOT NULL,
  `dia` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `lab_nome` varchar(50) NOT NULL,
  `lab_capacidade` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `alocacoes`
--

INSERT INTO `alocacoes` (`id`, `professor_nome`, `disciplina`, `turma_nome`, `num_alunos`, `dia`, `hora_inicio`, `hora_fim`, `lab_nome`, `lab_capacidade`, `created_at`) VALUES
(7, 'Michael Ferreira', 'Programação Web', 'INF2', 35, 'Segunda', '10:00:00', '12:00:00', 'Lab. Grande', 50, '2026-05-19 01:27:38'),
(8, 'fernando bandeira', 'Base de Dados', 'INF2', 35, 'Quarta', '08:00:00', '10:00:00', 'Lab. Grande', 50, '2026-05-19 01:27:38'),
(9, 'venancio amilton', 'Anatomia', 'ENF1', 28, 'Terça', '14:00:00', '16:00:00', 'Lab. Grande', 50, '2026-05-19 01:27:38');

-- --------------------------------------------------------

--
-- Estrutura da tabela `aulas`
--

DROP TABLE IF EXISTS `aulas`;
CREATE TABLE IF NOT EXISTS `aulas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_nome` varchar(100) NOT NULL,
  `disciplina` varchar(100) NOT NULL,
  `turma_nome` varchar(50) NOT NULL,
  `num_alunos` int(11) NOT NULL,
  `dia` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `tipo_aula` enum('Teórica','Prática') DEFAULT 'Prática',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `aulas`
--

INSERT INTO `aulas` (`id`, `professor_nome`, `disciplina`, `turma_nome`, `num_alunos`, `dia`, `hora_inicio`, `hora_fim`, `tipo_aula`) VALUES
(1, 'Michael Ferreira', 'Programação Web', 'INF2', 35, 'Segunda', '10:00:00', '12:00:00', 'Prática'),
(2, 'fernando bandeira', 'Base de Dados', 'INF2', 35, 'Quarta', '08:00:00', '10:00:00', 'Prática'),
(3, 'venancio amilton', 'Anatomia', 'ENF1', 28, 'Terça', '14:00:00', '16:00:00', 'Prática');

-- --------------------------------------------------------

--
-- Estrutura da tabela `config_disciplinas`
--

DROP TABLE IF EXISTS `config_disciplinas`;
CREATE TABLE IF NOT EXISTS `config_disciplinas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) NOT NULL,
  `disciplina_nome` varchar(100) NOT NULL,
  `total_aulas` int(11) NOT NULL,
  `perc_lab` int(11) NOT NULL,
  `perc_conf` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `config_disciplinas`
--

INSERT INTO `config_disciplinas` (`id`, `professor_id`, `disciplina_nome`, `total_aulas`, `perc_lab`, `perc_conf`) VALUES
(1, 2, 'Programação Web', 14, 60, 40),
(2, 4, 'Programação Web', 14, 70, 30),
(3, 4, 'Programação Web', 14, 20, 80);

-- --------------------------------------------------------

--
-- Estrutura da tabela `conflitos`
--

DROP TABLE IF EXISTS `conflitos`;
CREATE TABLE IF NOT EXISTS `conflitos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_nome` varchar(100) NOT NULL,
  `disciplina` varchar(100) NOT NULL,
  `turma_nome` varchar(50) NOT NULL,
  `num_alunos` int(11) NOT NULL,
  `dia` varchar(20) NOT NULL,
  `motivo` text NOT NULL,
  `resolvido` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `dias_aulas`
--

DROP TABLE IF EXISTS `dias_aulas`;
CREATE TABLE IF NOT EXISTS `dias_aulas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) NOT NULL,
  `data_aula` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `dias_aulas`
--

INSERT INTO `dias_aulas` (`id`, `professor_id`, `data_aula`, `hora_inicio`, `hora_fim`) VALUES
(1, 2, '2026-05-20', '10:00:00', '12:00:00'),
(2, 4, '2026-04-12', '12:17:00', '16:00:00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `disciplinas_professor`
--

DROP TABLE IF EXISTS `disciplinas_professor`;
CREATE TABLE IF NOT EXISTS `disciplinas_professor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) NOT NULL,
  `disciplina_nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `disciplinas_professor`
--

INSERT INTO `disciplinas_professor` (`id`, `professor_id`, `disciplina_nome`) VALUES
(1, 2, 'Programação Web'),
(2, 2, 'Base de Dados'),
(3, 2, 'Redes de Computadores'),
(8, 3, 'Banco de Dados'),
(7, 3, 'Redes'),
(6, 4, 'Programação Web'),
(9, 5, 'Estrutura de Dados'),
(10, 6, 'Inteligência Artificial'),
(11, 7, 'Porgramação WEb II'),
(12, 8, 'Java com Objectos'),
(13, 10, 'Programação Web'),
(14, 10, 'Base de Dados'),
(15, 12, 'Estudos Africanos'),
(16, 12, 'Inteligência Artificail'),
(17, 12, 'Base de Dados'),
(18, 12, 'Programção de Sistemas');

-- --------------------------------------------------------

--
-- Estrutura da tabela `laboratorios`
--

DROP TABLE IF EXISTS `laboratorios`;
CREATE TABLE IF NOT EXISTS `laboratorios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `capacidade` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `laboratorios`
--

INSERT INTO `laboratorios` (`id`, `nome`, `capacidade`) VALUES
(1, 'Lab. Grande', 50),
(2, '2.11', 100),
(3, '3.14', 10),
(4, 'n67', 78);

-- --------------------------------------------------------

--
-- Estrutura da tabela `professores`
--

DROP TABLE IF EXISTS `professores`;
CREATE TABLE IF NOT EXISTS `professores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `carga_horaria` int(11) DEFAULT '4',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `professores`
--

INSERT INTO `professores` (`id`, `user_id`, `carga_horaria`) VALUES
(1, 8, 4),
(2, 9, 4),
(3, 10, 4),
(4, 11, 4),
(5, 12, 4);

-- --------------------------------------------------------

--
-- Estrutura da tabela `reclamacoes`
--

DROP TABLE IF EXISTS `reclamacoes`;
CREATE TABLE IF NOT EXISTS `reclamacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `professor_id` (`professor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `reclamacoes`
--

INSERT INTO `reclamacoes` (`id`, `professor_id`, `mensagem`, `data_envio`) VALUES
(1, 2, 'O laboratório pequeno está com problemas de ar condicionado', '2026-05-17 20:34:24');

-- --------------------------------------------------------

--
-- Estrutura da tabela `salas`
--

DROP TABLE IF EXISTS `salas`;
CREATE TABLE IF NOT EXISTS `salas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `capacidade` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `salas`
--

INSERT INTO `salas` (`id`, `nome`, `capacidade`) VALUES
(1, 'Sala 101', 40),
(2, '1.27', 80),
(3, '0.12', 67);

-- --------------------------------------------------------

--
-- Estrutura da tabela `turmas`
--

DROP TABLE IF EXISTS `turmas`;
CREATE TABLE IF NOT EXISTS `turmas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `curso` varchar(100) NOT NULL,
  `num_alunos` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `turmas`
--

INSERT INTO `turmas` (`id`, `nome`, `curso`, `num_alunos`) VALUES
(3, 'ENF', 'Informática', 100),
(2, 'INF2', 'Informática', 35),
(4, 'CNT', 'Contabilidade E Fiscalidade', 12),
(5, 'CNT', 'Fiscalidade', 12);

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('secretaria','professor') DEFAULT 'professor',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `email`, `senha`, `tipo`, `created_at`) VALUES
(1, 'Secretaria Geral', 'secretaria@ekuikui', 'admin', 'secretaria', '2026-05-16 18:28:07'),
(2, 'Michael Ferreira', 'michael@2026', '123456', 'professor', '2026-05-17 15:53:40'),
(4, 'Professor Teste', 'teste@email.com', '123456', 'professor', '2026-05-18 17:56:47'),
(5, 'Michael Ferreira', 'michael@gmail.com', '$2a$10$sRoEdfTXZuuSm3htKWx0AOoDISSbLfYwtByt8doPn5VO8m8./EKBu', 'professor', '2026-05-18 23:23:43'),
(6, 'Fulano de Tal', 'fulano@gmail.com', '$2a$10$Lo6HPyTCbii8h3dtxU3Dwup3nxSJSYACE/cTJUNpxGaLI7ilMZWD2', 'professor', '2026-05-18 23:25:03'),
(7, 'António Manuel', 'manuel@2026', '$2a$10$tuq69Bf8s1.RzMPz0.4gN.X.AueEZcUTMFgHHADhfJ/SfnMOqAf.C', 'professor', '2026-05-18 23:32:06'),
(8, 'Cicranio de Tal', 'tal@gmail.com', '$2a$10$7BYAqdMiZp9ejNYoqBnxv.eD.JhN6uMKhhhcb6SrEdpZTtZcEEI7.', 'professor', '2026-05-18 23:49:45'),
(9, 'edojeojeochcjkdkhe', 'dkehdh@gmailcom', '$2a$10$W3DBSRTGD.71KcGiPq8ujOguWONVO2losJhDDdjVOr9GGWo1rexcK', 'professor', '2026-05-19 00:04:08'),
(10, 'Professor Teste', 'teste@gmail.com', '$2a$10$yGJXjgORxPH712WVdP0GV.3wT5M5dBVoYcdyubwb6RwdUO/peU.H.', 'professor', '2026-05-19 00:28:03'),
(12, 'Amante da Mandioca', 'amante@gmai.com', '$2a$10$WWgZZCyYCmpRQe86SxTdqOVmWqLCCxoh9Uuil3VxS79gpK3jwJQza', 'professor', '2026-05-19 01:32:23');
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
