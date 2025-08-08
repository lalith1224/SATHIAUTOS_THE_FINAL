CREATE TABLE master_data (
    product_code VARCHAR(20) PRIMARY KEY,
    s_no SERIAL,
    product_description VARCHAR(255) NOT NULL,
    grade VARCHAR(10),
    prod_group VARCHAR(255),
    last_used TIMESTAMPTZ
);

-- First QC table (QF 07 FBQ - 02) with micro/macro structure
CREATE TABLE "QF 07 FBQ - 02" (
    id SERIAL PRIMARY KEY,
    record_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    component_in_production VARCHAR(20) REFERENCES master_data(product_code) NOT NULL,
    flow_rate_setting_a DECIMAL,
    flow_rate_display_b DECIMAL,
    hot_box_temp DECIMAL,
    air_pressure DECIMAL,
    inject_pressure DECIMAL,
    feed_pipe_condition TEXT,
    powder_size DECIMAL,
    moisture DECIMAL,
    is_new_bag BOOLEAN DEFAULT FALSE,
    air_drier_function BOOLEAN,
    filter_cleaning BOOLEAN,
    gauge_test DECIMAL,
    signature TEXT,
    hourly_time TIMESTAMPTZ,
    micro_structure VARCHAR(100) DEFAULT 'Inoculation System Checks',
    macro_structure VARCHAR(100) DEFAULT 'Pre-Process'
);

-- Second QC table with combined design and event-based logging
CREATE TABLE "QF 07 FBQ - 03" (
    id SERIAL PRIMARY KEY,
    component_in_production VARCHAR(20) REFERENCES master_data(product_code) NOT NULL,
    inoculation_flow_rate_rpm DECIMAL,
    inoculation_flow_rate_gms DECIMAL,
    air_pressure DECIMAL CHECK (air_pressure >= 4.0),
    inject_pressure DECIMAL CHECK (inject_pressure <= 2.0),
    feed_pipe_condition TEXT,
    air_line_water_drainage BOOLEAN,
    hopper_cleaning BOOLEAN,
    inoculant_powder_size DECIMAL,
    inoculant_powder_moisture DECIMAL,
    is_new_bag BOOLEAN DEFAULT FALSE,
    gauge_test DECIMAL,
    micro_structure VARCHAR(100) DEFAULT 'Inoculation System Checks',
    macro_structure VARCHAR(100) DEFAULT 'Pre-Process'
);

-- Table for inspection register
CREATE TABLE IF NOT EXISTS inspection_register (
    id SERIAL PRIMARY KEY,
    inspection_date DATE NOT NULL,
    shift VARCHAR(50),
    item_description TEXT NOT NULL,
    inspection_time TIME,
    defects_and_quantity TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE recently_used_products (
    user_id VARCHAR(50),
    product_code VARCHAR(20) REFERENCES master_data(product_code),
    last_used TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_code)
);

-- Time study process table
CREATE TABLE time_study_process (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    shift VARCHAR(10),
    part_name VARCHAR(100) NOT NULL,
    heat_code VARCHAR(50) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    c FLOAT,
    si FLOAT,
    mn FLOAT,
    p FLOAT,
    s FLOAT,
    cr FLOAT,
    ni FLOAT,
    al FLOAT,
    cu FLOAT,
    sn FLOAT,
    mo FLOAT,
    cac2_s FLOAT,
    fesi_sh FLOAT,
    femn_sic FLOAT,
    cu_fecr FLOAT,
    carbon_steel VARCHAR(50),
    micro_structure VARCHAR(100) DEFAULT 'Melting/Pouring Control',
    macro_structure VARCHAR(100) DEFAULT 'In-Process Documents'
);

-- QC Register table
CREATE TABLE qc_register (
    id SERIAL PRIMARY KEY,
    record_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    record_date DATE NOT NULL,
    disa_line VARCHAR(20),
    part_name VARCHAR(100) NOT NULL,
    heat_code VARCHAR(50) NOT NULL,
    qty_moulds INTEGER,
    remarks TEXT,
    
    -- Metal Composition 1 (%)
    c1 FLOAT,
    si1 FLOAT,
    mn1 FLOAT,
    p1 FLOAT,
    s1 FLOAT,
    mg1 FLOAT,
    f_l1 FLOAT,
    cu1 FLOAT,
    cr1 FLOAT,
    
    -- Metal Composition 2 (%)
    c2 FLOAT,
    si2 FLOAT,
    mn2 FLOAT,
    s2 FLOAT,
    cr2 FLOAT,
    cu2 FLOAT,
    sn2 FLOAT,
    
    -- Pouring Parameters
    pouring_time TIME,
    pouring_temp FLOAT,
    pp_code VARCHAR(20),
    fc_no_heat_no VARCHAR(50),
    
    -- Magnesium Treatment
    mg_kgs FLOAT,
    res_mg FLOAT,
    converter_percent FLOAT,
    rec_mg_percent FLOAT,
    stream_innoculat FLOAT,
    p_time_sec FLOAT,
    
    -- Tapping Information
    treatment_no VARCHAR(20),
    con_no VARCHAR(20),
    tapping_time TIME,
    corrective_addition_kgs FLOAT,
    tapping_wt_kgs FLOAT
);

-- Online Micro Coupon Inspection table
CREATE TABLE online_micro_coupon_inspection (
    id SERIAL PRIMARY KEY,
    record_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    disa VARCHAR(255),
    pp_code VARCHAR(255),
    item_description TEXT,
    nodularity_percentage DECIMAL(5, 2),
    remarks TEXT,
    micro_structure VARCHAR(100) DEFAULT 'Micro Structure Analysis',
    macro_structure VARCHAR(100) DEFAULT 'Quality Control'
);