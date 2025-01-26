const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {

    /*
    const cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'quantity', header: 'Quantity' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
    */
    
    const reports = ref([]);  
    const report_datarows = ref([]);
    const dt = ref();
    const exportFilenameCsv = ref();
    const selectedReport = ref();

    const selectedReport_changed = (event) => {
      exportFilenameCsv.value = "report_" + event.value.id;
      fetch("./reports/report_" + event.value.id + ".json")
      .then(response => response.json())
      .then(json => report_datarows.value = json);
    }

    const loadReports = () => {
      fetch("./reports/reports.json")
      .then(response => response.json())
      .then(json => reports.value = json);
    };

    const exportCSV = () => { 
      dt.value.exportCSV(); 
    };
    
    const exportPDF = () => {
        const doc = new jspdf.jsPDF('p');
        /*
        doc.autoTable(
          { columns: exportColumns, 
            body: report_datarows
          }
        );
        */
        const p_datatable = document.getElementById('report_datatable');
        const html_tables = p_datatable.querySelectorAll(':scope > div > table');
        doc.autoTable({ html: html_tables[0] });
        doc.save('report_' + selectedReport.value.id + '.pdf');
    };

    const exportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(report_datarows._rawValue);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAsExcelFile(excelBuffer, 'report_' + selectedReport.value.id);
    };
    
    const saveAsExcelFile = (buffer, fileName) => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data = new Blob([buffer], { type: EXCEL_TYPE });
      saveAs(data, fileName + EXCEL_EXTENSION);
    };    

    loadReports();
    
    return {
      reports,
      report_datarows,
      dt,
      exportFilenameCsv,
      selectedReport,
      selectedReport_changed,
      loadReports,
      exportCSV,
      exportPDF,
      exportExcel
    };
  },
});

app.use(PrimeVue.Config, {
  theme: {
    preset: PrimeVue.Themes.Aura,
  },
});

/*
app.use(PrimeVue.ConfirmationService);
app.use(PrimeVue.ToastService);
*/

app.component('p-button', PrimeVue.Button);
app.component('p-datatable', PrimeVue.DataTable);
app.component('p-column', PrimeVue.Column);
app.component('p-columngroup', PrimeVue.ColumnGroup);
app.component('p-row', PrimeVue.Row);
app.component('p-select', PrimeVue.Select);
/*
app.component('p-inputnumber', PrimeVue.InputNumber);
app.component('p-inputtext', PrimeVue.InputText);
app.component('p-tag', PrimeVue.Tag);
app.component('p-datepicker', PrimeVue.DatePicker);
app.component('p-dialog', PrimeVue.Dialog);
app.component('p-confirmdialog', PrimeVue.ConfirmDialog);
app.component('p-toast', PrimeVue.Toast);
*/

app.directive('tooltip', PrimeVue.Tooltip);

app.mount('#app');
