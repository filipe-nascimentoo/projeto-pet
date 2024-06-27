-- Tabela tb_enderecos
CREATE TABLE tb_enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(255),
    id_usuario INT NOT NULL
);

-- Tabela tb_informacaos_academicas
CREATE TABLE tb_informacaos_academicas (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ano_Inicio INT NOT NULL,
    ano_Fim INT NOT NULL,
    curso VARCHAR(255),
    instituicao VARCHAR(255),
    grau VARCHAR(100),
    data_cadastrado datetime NOT NULL DEFAULT current_timestamp(),
    status VARCHAR(50),
    id_usuario INT
);

-- Tabela tb_vagas
CREATE TABLE tb_vagas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remuneracao DECIMAL(10, 2),
    tipo VARCHAR(100),
    horario VARCHAR(100),
    cargo VARCHAR(255),
    descricao TEXT,
    data_limite DATE,
    status VARCHAR(50),
    id_empresa INT,
    data_inicio DATE,
    data_cadastrado datetime NOT NULL DEFAULT current_timestamp()
);