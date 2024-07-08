-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.27-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para db_adote_pet
DROP DATABASE IF EXISTS `db_adote_pet`;
CREATE DATABASE IF NOT EXISTS `db_adote_pet` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db_adote_pet`;

-- Copiando estrutura para tabela db_adote_pet.adocao
DROP TABLE IF EXISTS `adocao`;
CREATE TABLE IF NOT EXISTS `adocao` (
  `id_adocao` int(11) NOT NULL AUTO_INCREMENT,
  `fk_id_pet` int(11) NOT NULL,
  `fk_id_pessoa` int(11) NOT NULL,
  `data_adocao` date NOT NULL DEFAULT current_timestamp(),
  `responsavel` varchar(50) NOT NULL,
  PRIMARY KEY (`id_adocao`) USING BTREE,
  KEY `FK_ID_PET` (`fk_id_pet`) USING BTREE,
  KEY `FK_ID_PESSOA` (`fk_id_pessoa`) USING BTREE,
  CONSTRAINT `adocao_ibfk_1` FOREIGN KEY (`fk_id_pet`) REFERENCES `pet` (`id`),
  CONSTRAINT `adocao_ibfk_2` FOREIGN KEY (`fk_id_pessoa`) REFERENCES `pessoa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_adote_pet.adocao: ~8 rows (aproximadamente)
DELETE FROM `adocao`;
INSERT INTO `adocao` (`id_adocao`, `fk_id_pet`, `fk_id_pessoa`, `data_adocao`, `responsavel`) VALUES
	(1, 4, 1, '2024-05-27', 'Jose'),
	(2, 5, 2, '2024-05-27', 'Jose'),
	(3, 6, 3, '2024-05-27', 'Jose'),
	(4, 7, 4, '2024-05-27', 'Jose'),
	(5, 8, 5, '2024-05-27', 'Jose'),
	(6, 11, 6, '2024-06-06', 'João Silva'),
	(7, 12, 7, '2024-06-06', 'Maria Lima'),
	(9, 14, 8, '2024-06-06', 'Carlos Souza');

-- Copiando estrutura para tabela db_adote_pet.pessoa
DROP TABLE IF EXISTS `pessoa`;
CREATE TABLE IF NOT EXISTS `pessoa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cpf` varchar(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `rua` varchar(50) NOT NULL,
  `numero` varchar(13) NOT NULL,
  `bairro` varchar(50) NOT NULL,
  `complemento` varchar(50) DEFAULT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` char(2) NOT NULL,
  `cep` varchar(8) NOT NULL,
  `rg` varchar(10) NOT NULL,
  `telefone` varchar(11) NOT NULL,
  `data_nascimento` date NOT NULL,
  `senha` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_adote_pet.pessoa: ~9 rows (aproximadamente)
DELETE FROM `pessoa`;
INSERT INTO `pessoa` (`id`, `cpf`, `nome`, `email`, `rua`, `numero`, `bairro`, `complemento`, `cidade`, `estado`, `cep`, `rg`, `telefone`, `data_nascimento`, `senha`) VALUES
	(1, '12345678909', 'Filipe', '', 'Rua 1', '10', 'Bobos', '', 'São João da Boa Vista', 'SP', '13877056', '417967706', '19981068804', '1995-06-22', '123456'),
	(2, '10245678911', 'Guilherme', '', 'Rua 2', '23', 'Bobos', '', 'Aguaí', 'SP', '13800408', '417967713', '1982766552', '1993-06-12', '654123'),
	(3, '10123458911', 'Maria', '', 'Rua 3', '13', 'Bobos', '', 'São Paulo', 'SP', '12350408', '411234513', '1915466552', '1990-06-12', '365223'),
	(4, '10123465412', 'Thiago', '', 'Rua 6', '850', 'Bobos', '', 'São Paulo', 'SP', '12356541', '411123453', '1917894562', '1970-07-01', '987423'),
	(5, '10123123456', 'Mariano', '', 'Rua 10', '1050', 'Bobos', '', 'São Paulo', 'SP', '11234541', '654123453', '1916541230', '2000-07-01', '897423'),
	(6, '12345678910', 'João Silva', 'joao@email.com', 'Rua A', '123', 'Centro', 'Apt 101', 'São Paulo', 'SP', '01000000', '123456789', '1912345678', '1985-05-20', 'senha123'),
	(7, '98765432100', 'Maria Lima', 'maria@email.com', 'Av. B', '456', 'Norte', 'Casa', 'Rio de Janeiro', 'RJ', '20000000', '987654321', '1923456789', '1990-07-15', 'senha456'),
	(8, '45678912322', 'Carlos Souza', 'carlos@email.com', 'Rua C', '789', 'Sul', 'Bloco B', 'Belo Horizonte', 'MG', '30000000', '456789123', '1934567890', '1982-02-10', 'senha789'),
	(13, '42512262839', 'Luis Filipe dos Santos Nascimento', 'filipe_nascimentoo@hotmail.com', 'Maria de Lourdes Valim Campos', '181', 'Jd. Aurora', 'casa', 'São João da Boa Vista', 'SP', '13877056', '417967706', '19981068804', '1995-06-22', '123');

-- Copiando estrutura para tabela db_adote_pet.pet
DROP TABLE IF EXISTS `pet`;
CREATE TABLE IF NOT EXISTS `pet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `raca` varchar(50) NOT NULL,
  `porte` varchar(50) NOT NULL,
  `data_nascimento` date DEFAULT current_timestamp(),
  `observacao` varchar(400) DEFAULT NULL,
  `cor` varchar(10) NOT NULL,
  `sexo` char(1) NOT NULL,
  `castrado` varchar(5) DEFAULT NULL,
  `adotado` varchar(5) DEFAULT NULL,
  `imagem` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_adote_pet.pet: ~9 rows (aproximadamente)
DELETE FROM `pet`;
INSERT INTO `pet` (`id`, `nome`, `raca`, `porte`, `data_nascimento`, `observacao`, `cor`, `sexo`, `castrado`, `adotado`, `imagem`) VALUES
	(4, 'Toby', 'Salsichinha', 'Pequeno', '2020-06-01', 'Encontrada na rua', 'Mestiço', 'M', 'on', 'on', NULL),
	(5, 'Bili', 'Dálmata', 'Grande', '2019-05-23', '', 'Cinza', 'M', 'on', 'on', NULL),
	(6, 'Meg', 'Pinscher', 'Pequeno', '2013-05-03', '', 'Cinza', 'F', 'on', 'on', NULL),
	(7, 'Caramelo', 'Viralata', 'Pequeno', '2022-06-03', '', 'Caramelo', 'M', 'off', 'on', NULL),
	(8, 'Bilu', 'Labrador', 'Grande', '2024-03-03', '', 'Caramelo', 'M', 'off', 'on', NULL),
	(11, 'Rex', 'Labrador', 'Grande', '2021-01-01', 'Muito ativo', 'Marrom', 'M', 'on', 'on', NULL),
	(12, 'Luna', 'Siamês', 'Pequeno', '2022-03-15', 'Calma e carinhosa', 'Branco', 'F', 'off', 'on', NULL),
	(14, 'Nala', 'Persa', 'Pequeno', '2020-11-25', 'Independente', 'Cinza', 'F', 'on', 'on', NULL),
	(88, 'toto', 'vira lata', 'Médio', '1995-06-22', 'teste', 'branco', 'M', 'on', NULL, '1720277088622.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
