//
//  MasterViewController.swift
//  AddressBook
//
//  Created by Robert Swanson on 4/28/19.
//  Copyright © 2019 Robert Swanson. All rights reserved.
//

import UIKit
import SQLite

class MasterViewController: UITableViewController, UISearchBarDelegate{

    @IBOutlet weak var searchBar: UISearchBar!
    var detailViewController: DetailViewController? = nil
    
    var dbURL: URL?
    var db: Connection?
    var groups: [(Int64, String, String)] = []
    var names: [Row] = []
    
    //Contact
    let contact = Table("contactTable")
    let contactIdPK = Expression<Int64>("contactIdPK")
    let firstNameF = Expression<String>("firstName")
    let lastNameF = Expression<String>("lastName")
    let primaryEmailF = Expression<String>("primaryEmail")
    let secondaryEmailF = Expression<String?>("secondaryEmail")
    let organizationF = Expression<String?>("organization")
    let primaryPhoneF = Expression<Int64?>("primaryPhone")
    let secondaryPhoneF = Expression<Int64?>("secondaryPhone")
    let birthdayF = Expression<String?>("birthday")
    let notesF = Expression<String?>("notes")
    
    //Group
    let group = Table("groupTable")
    let groupIdPK = Expression<Int64>("groupIdPK")
    let groupNameF = Expression<String>("groupName")
    let groupNoteF = Expression<String>("groupNote")
    
    //Contact Group
    let contactGroup = Table("contactGroupTable")
    let contactIdFK = Expression<Int64>("contactIdFK")
    let groupIdFK = Expression<Int64>("groupIdFK")

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        do{
            try openConnection()
        } catch{
            print("Connection Failed")
        }
        
        navigationItem.leftBarButtonItem = editButtonItem
        let addButton = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(insertNewObject(_:)))
        let exportButton = UIBarButtonItem(barButtonSystemItem: .action, target: self, action: #selector(exportCSV(sender:)))
        navigationItem.rightBarButtonItems = [exportButton, addButton]
        
        if let split = splitViewController {
            let controllers = split.viewControllers
            detailViewController = (controllers[controllers.count-1] as! UINavigationController).topViewController as? DetailViewController
            detailViewController?.masterViewController = self
            detailViewController?.row = getNameList().first
            tableView.selectRow(at: IndexPath(row: 0, section: 0), animated: true, scrollPosition: .top)
        }
        
        tableView.scrollToRow(at: IndexPath(row: 0, section: 0), at: .top, animated: false)
        
        searchBar.delegate = self
    }
    
    override func viewWillAppear(_ animated: Bool) {
        clearsSelectionOnViewWillAppear = splitViewController!.isCollapsed
        super.viewWillAppear(animated)
    }

    @objc
    func insertNewObject(_ sender: Any) {
       //Insert button
        do{
            try addContact(firstName: "new", lastName: "contact", primaryEmail: "example@foo.com", secondaryEmail: nil, organization: nil, primaryPhone: nil, secondaryPhone: nil, birthday: nil, notes: nil)
        }catch{
            print("Insert Failed")
        }
    }
    
    @objc
    func exportCSV(sender: Any) {
        print("Export")
        do{
            let contactURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false).appendingPathComponent("contact.csv")
            let contactText = getContactText()
            try contactText.write(to: contactURL, atomically: true, encoding: .ascii)
            let contactFile = NSURL(fileURLWithPath: contactURL.path)
            
            let groupURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false).appendingPathComponent("group.csv")
            let groupText = getGroupText()
            try groupText.write(to: groupURL, atomically: true, encoding: .ascii)
            let groupFile = NSURL(fileURLWithPath: groupURL.path)
            
            let contactGroupURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false).appendingPathComponent("contactGroup.csv")
            let contactGroupText = getContactGroupText()
            try contactGroupText.write(to: contactGroupURL, atomically: true, encoding: .ascii)
            let contactGroupFile = NSURL(fileURLWithPath: contactGroupURL.path)
            
            let shareSheet = UIActivityViewController(activityItems: [contactFile, groupFile, contactGroupFile, dbURL!], applicationActivities: nil)
            self.present(shareSheet, animated: true, completion: nil)
        }catch{
            print("Export Error: \(error)")
        }
    }
    
    @objc
    func search(sender: Any){
        print("Search")
    }

    // MARK: - Segues

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showDetail" {
            if let ip = tableView.indexPathForSelectedRow {
                let controller = (segue.destination as! UINavigationController).topViewController as! DetailViewController
                controller.navigationItem.leftBarButtonItem = splitViewController?.displayModeButtonItem
                controller.navigationItem.leftItemsSupplementBackButton = true
                
                let row = getNameList()[ip.row]
                controller.navigationItem.title = row[firstNameF] + " " + row[lastNameF]
                controller.masterViewController = self
                controller.row = row
                controller.rowID = row[contactIdPK]
                controller.groups = getGroups(contactId: controller.rowID!)
            }
        }
    }
    
    // MARK: - Table View

    override func numberOfSections(in tableView: UITableView) -> Int {
        names = getNameList()
        groups = getGroups(contactId: -1)
        return 2
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if(section == 0){
            return names.count
        }else{
            return groups.count
        }
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: indexPath.section == 0 ? "Cell" : "group", for: indexPath)
        if(indexPath.section == 0){
            let contact = names[indexPath.row]
            cell.textLabel?.text = "\(contact[firstNameF]) \(contact[lastNameF])"
        }else{
            let group = groups[indexPath.row]
            cell.textLabel?.text = group.1
        }
        return cell
    }

    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        return true
    }

    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            if(indexPath.section == 0){
                let row = getNameList()[indexPath.row]
                do{
                    try db!.run(contact.filter(contactIdPK == row[contactIdPK]).delete())
                }catch{
                    print("Failed Delete: \(error)")
                }
            }else{
                do{
                    deleteGroup(groupID: groups[indexPath.row].0)
                }
            }
            tableView.deleteRows(at: [indexPath], with: .automatic)
        }
    }

    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        if(section == 0){
            return "Contacts"
        }
        return "Groups"
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if(indexPath.section == 1){
            let alert = UIAlertController(title: "Members of group", message: getGroupMembers(groupID: groups[indexPath.row].0), preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            present(alert, animated: true, completion: nil)
            tableView.deselectRow(at: indexPath, animated: true)
        }
    }
    
    //MARK: - Searching
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        tableView.reloadData()
    }
    
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
    }
    
    //MARK: - SQLite
    enum SQLiteError: Error{
        case StatementSyntaxError
        case StatementExecutionError
        case ConnectionError
    }
    
    func openConnection() throws{
        dbURL = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false).appendingPathComponent("Addresses.sqlite")
        db = try Connection((dbURL?.path)!)
        try initializeDatabase()
    }
    
    func initializeDatabase() throws{
        do{
            let _ = try db?.prepare(contact)
        }catch{
            print("contacts table doesn't exist, creating...")
            try db?.run(contact.create { t in
                t.column(contactIdPK, primaryKey: .autoincrement)
                t.column(firstNameF)
                t.column(lastNameF)
                t.column(primaryEmailF)
                t.column(secondaryEmailF)
                t.column(organizationF)
                t.column(primaryPhoneF)
                t.column(secondaryPhoneF)
                t.column(birthdayF)
                t.column(notesF)
            })
            try addContact(firstName: "Robert", lastName: "Swanson", primaryEmail: "firstEmail", secondaryEmail: "secondEmail", organization: "Taylor", primaryPhone: 123, secondaryPhone: 321, birthday: "12-11-99", notes: "Notes, Yeah!")
        }
       
        do{
            let _ = try db?.prepare(group)
        }catch{
            print("group table doesn't exist, creating...")
            try db?.run(group.create { t in
                t.column(groupIdPK, primaryKey: .autoincrement)
                t.column(groupNameF)
                t.column(groupNoteF)
            })
        }
        do{
            let _ = try db?.prepare(contactGroup)
        }catch{
            print("contactGroup table doesn't exist, creating...")
            try db?.run(contactGroup.create { t in
                t.column(contactIdFK)
                t.column(groupIdFK)
                t.foreignKey(contactIdFK, references: contact, contactIdPK)
                t.foreignKey(groupIdFK, references: group, groupIdPK)
            })
        }
    }
    
    func addContact(firstName: String, lastName: String, primaryEmail: String, secondaryEmail: String?, organization: String?, primaryPhone: Int64?, secondaryPhone: Int64?, birthday: String?, notes: String?) throws{
        let insert = contact.insert(firstNameF <- firstName, lastNameF <- lastName, primaryEmailF <- primaryEmail, secondaryEmailF <- secondaryEmail, organizationF <- organization, primaryPhoneF <- primaryPhone, secondaryPhoneF <- secondaryPhone, birthdayF <- birthday, notesF <- notes)
        do{
            let rowId = try db?.run(insert)
            
            let rows = getNameList()
            var i = 0
            for row in rows{
                if row[contactIdPK] == rowId{
                    tableView.insertRows(at: [IndexPath(row: i, section: 0)], with: .automatic)
                    break
                }
                i+=1
            }
            print(rowId ?? "Empty")

        }catch{
            print("INSERT ERROR: \(error)")
        }
    }
    
    func getNameList() -> [Row] {
        do{
            let seq = try db?.prepare(contact.order(lastNameF.asc))
            var rv = [Row]()
            if(seq != nil){
                for contact in seq!{
                    if(searchBar!.text!.isEmpty || contact[firstNameF].lowercased().contains(searchBar!.text!.lowercased()) || contact[lastNameF].lowercased().contains(searchBar!.text!.lowercased())){
                        rv.append(contact)
                    }
                }
            }
            return rv
        }catch{
            print("ERROR getting data from database: \(error)")
            return []
        }
    }
    
    func getContactText() -> String{
        var rv = "First_Name, Last_Name, Primary_Email, Secondary_Email, Primary_Phone, Secondary_Phone, Organization, Birthday, Notes\n"
        do{
            let seq = try db?.prepare(contact.order(lastNameF.asc))
            if(seq != nil){
                for contact in seq!{
                    
                    rv += "\(contact[firstNameF].description), \(contact[lastNameF].description), \((contact[primaryEmailF]).description), \((contact[secondaryEmailF] ?? "").description), \((contact[primaryPhoneF] ?? 0).description), \((contact[secondaryPhoneF] ?? 0).description), \((contact[organizationF] ?? "").description), \((contact[birthdayF] ?? "").description), \((contact[notesF] ?? "").description)\n"
                }
            }
            return rv
        }catch{
            print("ERROR getting data from database: \(error)")
            return ""
        }
    }
    func getGroupText() -> String{
        var rv = "Group_Id, Group_Name, Group_Note\n"
        do{
            let seq = try db?.prepare(group.order(groupNameF.asc))
            if(seq != nil){
                for group in seq!{
                    rv += "\(group[groupIdPK]), \(group[groupNameF]), \(group[groupNoteF])\n"
                }
            }
            return rv
        }catch{
            print("ERROR getting data from database: \(error)")
            return ""
        }
    }
    func getContactGroupText() -> String{
        var rv = "Contact_Id, Group_Id\n"
        do{
            let seq = try db?.prepare(contactGroup.order(groupIdFK.asc))
            if(seq != nil){
                for contactGroup in seq!{
                    rv += "\(contactGroup[contactIdFK]), \(contactGroup[groupIdFK])\n"
                }
            }
            return rv
        }catch{
            print("ERROR getting data from database: \(error)")
            return ""
        }
    }

    enum updateError: Error{
        case emptyValueOnRequiredField
        
    }
    
    func updateRow(id: Int64, col: Expression<String?>, value: String?){
        do{
            try db!.run(contact.filter(contactIdPK == id).update(col <- value))
            print("Success!")
        }catch{
            print("Update Failed: \(error)")
        }
    }
    func updateRow(id: Int64, col: Expression<String>, value: String){
        do{
            try db!.run(contact.filter(contactIdPK == id).update(col <- value))
            tableView.reloadData()
            print("Success!")
        }catch{
            print("Update Failed: \(error)")
        }
    }
    func updateRow(id: Int64, col: Expression<Int64?>, value: Int64?){
        do{
            try db!.run(contact.filter(contactIdPK == id).update(col <- value))
            print("Success!")
        }catch{
            print("Update Failed: \(error)")
        }
    }
    func updateRow(id: Int64, col: Expression<Int64>, value: Int64){
        do{
            try db!.run(contact.filter(contactIdPK == id).update(col <- value))
            print("Success!")
        }catch{
            print("Update Failed: \(error)")
        }
    }
    
    func updateSelection(id: Int64) -> Row?{
        tableView.reloadData()
        var index = 0
        for tRow in getNameList(){
            if tRow[contactIdPK] == id{
                tableView.selectRow(at: IndexPath(row: index, section: 0), animated: true, scrollPosition: .middle)
                return tRow
            }
            index+=1
        }
        return nil
    }
    
    //L>M OK
    //R>M OK
    //L>(R>M) NO
    
    func getGroups(contactId: Int64) -> [(Int64, String, String)]{
        do{
            if(contactId == -1){
                var rv: [(Int64, String, String)] = []
                for group in try (db?.prepare(group))!{
                    rv.append((group[groupIdPK],group[groupNameF],group[groupNoteF]))
                }
                return rv
            }else{
                let leftJoinMid = contact.filter(contactIdPK == contactId || contactId == -1).join(contactGroup, on: contactIdFK == contact[contactIdPK])
                let contactGroups = try db?.prepare(leftJoinMid.order(groupIdFK.asc))
                var rv: [(Int64, String, String)] = []
                if let safeGroups = contactGroups{
                    for row in safeGroups{
                        let groupNames = try db?.prepare(group.filter(groupIdPK == row[groupIdFK]))
                        for one in groupNames!{
                            rv.append((row[groupIdFK], one[groupNameF], one[groupNoteF]))
                        }
                    }
                }
                return rv
                
            }
        }catch{
            print("Join Errror: \(error)")
            return []
        }
    }
    
    func addGroup(groupName: String, contactID: Int64){
        do{
            var groupRow = try db?.prepare(group.filter(groupNameF == groupName)).first(where: { t in return true})
            if groupRow == nil{ //New Group
                let id = try db!.run(group.insert(groupNameF <- groupName, groupNoteF <- ""))
                groupRow = try db!.prepare(group.filter(groupIdPK == id)).first(where: { t in return true})
            }
            try db?.run(contactGroup.insert(contactIdFK <- contactID, groupIdFK <- groupRow![groupIdPK]))
            tableView.reloadData()
        }catch{
            print("ERROR adding group: \(error)")
        }
    }
    
    func editGroupNote(groupID: Int64, note: String){
        do{
            try db!.run(group.filter(groupIdPK == groupID).update(groupNoteF <- note))
        }catch{
            print("Group Note Error: \(error)")
        }
    }
    
    func removeGroup(contactID: Int64, groupID: Int64){
        do{
            try db?.run(contactGroup.filter(contactIdFK == contactID).filter(groupIdFK == groupID).delete())
        }catch{
            print("Delete Error: \(error)")
        }
    }
    
    func deleteGroup(groupID: Int64){
        do{
            let rightJoinMid = group.filter(groupIdPK == groupID).join(contactGroup, on: contactIdFK == group[groupIdPK])
            let contactGroups = try db?.prepare(rightJoinMid.order(groupIdFK.asc))
            if let safeGroups = contactGroups{
                for row in safeGroups{
                  try db?.run(contactGroup.filter(groupIdFK == row[groupIdFK]).filter(contactIdFK == row[contactIdFK]).delete())
                }
            }
            try db?.run(group.filter(groupIdPK == groupID).delete())
            groups = getGroups(contactId: -1)
        }catch{
            print("Delete Group Error: \(error)")
        }
    }
    
    func getGroupMembers(groupID: Int64) -> String{
        do{
            let rightJoinMid = group.filter(groupIdPK == groupID).join(contactGroup, on: groupIdFK == group[groupIdPK])
            let contactGroups = try db?.prepare(rightJoinMid.order(contactIdFK.asc))
            var rv = ""
            if let safeGroups = contactGroups{
                for row in safeGroups{
                    let id = row[contactIdFK]
                    for name in names{
                        if name[contactIdPK] == id{
                            rv += name[firstNameF] + " " + name[lastNameF] + "\n"
                            break
                        }
                    }
                }
            }
            return rv
        }catch{
            print("Delete Group Error: \(error)")
            return "ERROR"
        }
    }
}
