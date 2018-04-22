CREATE TABLE D0055
(
  instruction_number CHAR(12),
  instruction_type CHAR(5),
  mpan_core CHAR(13),
  regi DATE,
  energisation_status CHAR(1),
  measurement_class_id CHAR(1),
  meter_timeswitch_code CHAR(3),
  profile_class_id CHAR(1),
  standard_settlement_configuration_id CHAR(4),
  data_aggregator_id CHAR(4),
  data_aggregation_type CHAR(1),
  data_collector_id CHAR(4),
  data_collector_type CHAR(1),
  meter_operator_id CHAR(4),
  meter_operator_type CHAR(1),
  tenancy_change_indicator CHAR(1)
);

COPY D0055 FROM '/data/D0055.csv' CSV HEADER;